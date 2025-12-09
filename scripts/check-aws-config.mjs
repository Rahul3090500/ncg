#!/usr/bin/env node
/**
 * AWS Configuration Checker
 * 
 * Checks AWS RDS and related configuration to diagnose connection issues
 * Requires AWS CLI to be configured with appropriate credentials
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function success(message) {
  log(`✅ ${message}`, 'green')
}

function error(message) {
  log(`❌ ${message}`, 'red')
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function section(title) {
  console.log('')
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'cyan')
  log(title, 'cyan')
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'cyan')
  console.log('')
}

// Extract RDS endpoint from environment or code
function getRdsEndpoint() {
  try {
    // Try to read from .env file
    const envPath = resolve(__dirname, '../.env')
    const envContent = readFileSync(envPath, 'utf8')
    const match = envContent.match(/DATABASE_URI=postgresql:\/\/[^@]+@([^:]+):(\d+)/)
    if (match) {
      return {
        host: match[1],
        port: match[2],
      }
    }
  } catch (err) {
    // .env not found or not readable
  }
  
  // Fallback to known endpoint
  return {
    host: 'ncg-postgres.cd4qk06e69gd.eu-north-1.rds.amazonaws.com',
    port: '5432',
  }
}

// Check if AWS CLI is available
function checkAwsCli() {
  try {
    execSync('aws --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// Run AWS CLI command
function runAwsCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    return { success: true, data: JSON.parse(result) }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Check RDS instance
async function checkRdsInstance(endpoint) {
  section('RDS Instance Configuration')
  
  const instanceId = endpoint.host.split('.')[0]
  const region = endpoint.host.split('.')[2] || 'eu-north-1'
  
  info(`Checking RDS instance: ${instanceId} in region: ${region}`)
  
  const command = `aws rds describe-db-instances --db-instance-identifier ${instanceId} --region ${region} --output json`
  const result = runAwsCommand(command)
  
  if (!result.success) {
    error(`Failed to query RDS: ${result.error}`)
    warning('Make sure AWS CLI is configured with appropriate credentials')
    return
  }
  
  const dbInstance = result.data.DBInstances?.[0]
  if (!dbInstance) {
    error('RDS instance not found')
    return
  }
  
  success(`RDS Instance Found: ${dbInstance.DBInstanceIdentifier}`)
  info(`Status: ${dbInstance.DBInstanceStatus}`)
  info(`Engine: ${dbInstance.Engine} ${dbInstance.EngineVersion}`)
  info(`Instance Class: ${dbInstance.DBInstanceClass}`)
  info(`Publicly Accessible: ${dbInstance.PubliclyAccessible ? 'Yes ✅' : 'No ❌'}`)
  info(`Endpoint: ${dbInstance.Endpoint?.Address}:${dbInstance.Endpoint?.Port}`)
  info(`VPC: ${dbInstance.DBSubnetGroup?.VpcId}`)
  
  // Check security groups
  if (dbInstance.VpcSecurityGroups?.length > 0) {
    console.log('')
    info('Security Groups:')
    dbInstance.VpcSecurityGroups.forEach((sg, index) => {
      console.log(`  ${index + 1}. ${sg.VpcSecurityGroupId} (Status: ${sg.Status})`)
    })
  }
  
  // Check connection metrics
  console.log('')
  info('Checking connection metrics...')
  const metricsCommand = `aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name DatabaseConnections --dimensions Name=DBInstanceIdentifier,Value=${instanceId} --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) --end-time $(date -u +%Y-%m-%dT%H:%M:%S) --period 300 --statistics Average,Maximum --region ${region} --output json`
  const metricsResult = runAwsCommand(metricsCommand)
  
  if (metricsResult.success && metricsResult.data.Datapoints?.length > 0) {
    const latest = metricsResult.data.Datapoints[metricsResult.data.Datapoints.length - 1]
    info(`Current Connections: ${latest.Average?.toFixed(1) || 0} (Max: ${latest.Maximum || 0})`)
  }
}

// Check Security Group Rules
async function checkSecurityGroups(endpoint) {
  section('Security Group Configuration')
  
  const region = endpoint.host.split('.')[2] || 'eu-north-1'
  
  // First get RDS instance to find security groups
  const instanceId = endpoint.host.split('.')[0]
  const rdsCommand = `aws rds describe-db-instances --db-instance-identifier ${instanceId} --region ${region} --output json`
  const rdsResult = runAwsCommand(rdsCommand)
  
  if (!rdsResult.success || !rdsResult.data.DBInstances?.[0]) {
    error('Cannot check security groups - RDS instance not found')
    return
  }
  
  const securityGroupIds = rdsResult.data.DBInstances[0].VpcSecurityGroups?.map(sg => sg.VpcSecurityGroupId) || []
  
  if (securityGroupIds.length === 0) {
    warning('No security groups found')
    return
  }
  
  securityGroupIds.forEach(sgId => {
    info(`Checking Security Group: ${sgId}`)
    const sgCommand = `aws ec2 describe-security-groups --group-ids ${sgId} --region ${region} --output json`
    const sgResult = runAwsCommand(sgCommand)
    
    if (sgResult.success && sgResult.data.SecurityGroups?.[0]) {
      const sg = sgResult.data.SecurityGroups[0]
      success(`Security Group: ${sg.GroupName} (${sg.GroupId})`)
      
      // Check inbound rules for PostgreSQL
      const postgresRules = sg.IpPermissions?.filter(rule => 
        rule.FromPort === 5432 || rule.ToPort === 5432 || rule.IpProtocol === 'tcp'
      ) || []
      
      if (postgresRules.length > 0) {
        console.log('')
        info('Inbound Rules for PostgreSQL (Port 5432):')
        postgresRules.forEach((rule, index) => {
          const sources = rule.IpRanges?.map(ip => ip.CidrIp).join(', ') || 'N/A'
          const allowed = sources.includes('0.0.0.0/0') ? '✅' : '⚠️'
          console.log(`  ${index + 1}. ${allowed} Sources: ${sources}`)
        })
      } else {
        warning('No inbound rules found for PostgreSQL port 5432')
      }
    }
  })
}

// Check VPC Configuration
async function checkVpc(endpoint) {
  section('VPC Configuration')
  
  const region = endpoint.host.split('.')[2] || 'eu-north-1'
  const instanceId = endpoint.host.split('.')[0]
  
  const rdsCommand = `aws rds describe-db-instances --db-instance-identifier ${instanceId} --region ${region} --output json`
  const rdsResult = runAwsCommand(rdsCommand)
  
  if (!rdsResult.success || !rdsResult.data.DBInstances?.[0]) {
    error('Cannot check VPC - RDS instance not found')
    return
  }
  
  const vpcId = rdsResult.data.DBInstances[0].DBSubnetGroup?.VpcId
  if (!vpcId) {
    warning('VPC ID not found')
    return
  }
  
  info(`VPC ID: ${vpcId}`)
  
  const vpcCommand = `aws ec2 describe-vpcs --vpc-ids ${vpcId} --region ${region} --output json`
  const vpcResult = runAwsCommand(vpcCommand)
  
  if (vpcResult.success && vpcResult.data.Vpcs?.[0]) {
    const vpc = vpcResult.data.Vpcs[0]
    info(`VPC CIDR: ${vpc.CidrBlock}`)
    info(`State: ${vpc.State}`)
  }
}

// Main function
async function main() {
  console.log('')
  log('🔍 AWS Configuration Checker', 'cyan')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  console.log('')
  
  // Check AWS CLI
  if (!checkAwsCli()) {
    error('AWS CLI is not installed or not in PATH')
    console.log('')
    info('Install AWS CLI: https://aws.amazon.com/cli/')
    info('Configure credentials: aws configure')
    process.exit(1)
  }
  
  success('AWS CLI is available')
  
  // Get RDS endpoint
  const endpoint = getRdsEndpoint()
  info(`RDS Endpoint: ${endpoint.host}:${endpoint.port}`)
  
  // Run checks
  await checkRdsInstance(endpoint)
  await checkSecurityGroups(endpoint)
  await checkVpc(endpoint)
  
  // Summary
  section('Summary')
  info('Check completed!')
  console.log('')
  info('Key things to verify:')
  console.log('  1. RDS is publicly accessible')
  console.log('  2. Security group allows inbound on port 5432 from 0.0.0.0/0')
  console.log('  3. No connection limits being reached')
  console.log('  4. VPC has proper internet gateway')
  console.log('')
}

main().catch(err => {
  error(`Error: ${err.message}`)
  process.exit(1)
})

