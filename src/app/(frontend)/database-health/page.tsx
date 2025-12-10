import React from 'react'

// Force dynamic rendering since we fetch real-time database health
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDatabaseHealth() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ncg-beta.vercel.app'
    const response = await fetch(`${baseUrl}/api/database-health`, {
      cache: 'no-store', // Always fetch fresh (page is force-dynamic)
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching database health:', error)
    return {
      status: 'error',
      errors: ['Failed to fetch database health'],
      timestamp: new Date().toISOString(),
    }
  }
}

export default async function DatabaseHealthPage() {
  const health = await getDatabaseHealth()

  const isHealthy = health.status === 'healthy'
  const isError = health.status === 'error'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Database Health Check</h1>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isHealthy 
                ? 'bg-green-100 text-green-800' 
                : isError 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {health.status?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>

          {/* Environment Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">NODE_ENV</div>
                  <div className="text-lg font-medium text-gray-900">{health.environment?.nodeEnv || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">VERCEL</div>
                  <div className="text-lg font-medium text-gray-900">{health.environment?.vercel || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">VERCEL_ENV</div>
                  <div className="text-lg font-medium text-gray-900">{health.environment?.vercelEnv || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">VERCEL_URL</div>
                  <div className="text-lg font-medium text-gray-900 break-all">{health.environment?.vercelUrl || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">NEXT_RUNTIME</div>
                  <div className="text-lg font-medium text-gray-900">{health.environment?.nextRuntime || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Configuration</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">DATABASE_URI Configured</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    health.database?.uriPresent 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {health.database?.uriPresent ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SSL CA Certificate</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    health.database?.sslCaPresent 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {health.database?.sslCaPresent ? 'Present' : 'Missing'}
                  </span>
                </div>
                {health.database?.connectionTest?.host && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Connection Details:</div>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Host:</span> {health.database.connectionTest.host}</div>
                      <div><span className="font-medium">Port:</span> {health.database.connectionTest.port}</div>
                      <div><span className="font-medium">Database:</span> {health.database.connectionTest.database}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Connection Test Results */}
          {health.database?.connectionTest && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Test Results</h2>
              <div className={`rounded-lg p-4 ${
                health.database.connectionTest.connected 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                {health.database.connectionTest.connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-green-900">Connection Successful!</span>
                    </div>
                    
                    {health.database.connectionTest.serverInfo && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Server Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">PostgreSQL Version:</span>
                            <div className="font-medium text-gray-900">{health.database.connectionTest.serverInfo.version}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Database:</span>
                            <div className="font-medium text-gray-900">{health.database.connectionTest.serverInfo.database}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">User:</span>
                            <div className="font-medium text-gray-900">{health.database.connectionTest.serverInfo.user}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Server Time:</span>
                            <div className="font-medium text-gray-900">
                              {new Date(health.database.connectionTest.serverInfo.serverTime).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {health.database.connectionTest.connections && (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Connection Statistics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Current Connections</span>
                            <span className="font-medium text-gray-900">
                              {health.database.connectionTest.connections.current} / {health.database.connectionTest.connections.max}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${health.database.connectionTest.connections.percentage}` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Usage: {health.database.connectionTest.connections.percentage}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Connection Time:</span>
                          <div className="font-medium text-gray-900">{health.database.connectionTest.connectTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Query Time:</span>
                          <div className="font-medium text-gray-900">{health.database.connectionTest.queryTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Time:</span>
                          <div className="font-medium text-gray-900">{health.database.connectionTest.totalTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-red-900">Connection Failed</span>
                    </div>
                    {health.database.connectionTest.error && (
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 mb-2">Error Details:</div>
                          <div className="text-red-600 font-mono text-xs break-all">
                            {health.database.connectionTest.error}
                          </div>
                          {health.database.connectionTest.errorCode && (
                            <div className="text-gray-600 mt-2">
                              Error Code: {health.database.connectionTest.errorCode}
                            </div>
                          )}
                          <div className="text-gray-600 mt-2">
                            Time taken: {health.database.connectionTest.totalTime}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {health.errors && health.errors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Errors</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2">
                  {health.errors.map((error: string, index: number) => (
                    <li key={index} className="text-red-800 text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="mt-6 text-sm text-gray-500 text-center">
            Last checked: {new Date(health.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

