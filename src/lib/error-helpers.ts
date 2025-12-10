export function isDatabaseConnectionError(error: any): boolean {
  const message = error?.message?.toLowerCase() || ''
  const code = error?.code || ''
  const causeMessage = error?.cause?.message?.toLowerCase() || ''

  return (
    code === '53300' ||
    message.includes('remaining connection slots') ||
    message.includes('too many connections') ||
    message.includes('connection pool') ||
    message.includes('pool') ||
    message.includes('rds_reserved') ||
    message.includes('database connection') ||
    message.includes('connection timeout') ||
    message.includes('connection terminated') ||
    message.includes('timeout exceeded') ||
    message.includes('timeout exceeded when trying to connect') ||
    message.includes('unavailable') ||
    message.includes('exhausted') ||
    message.includes('failed query') ||
    causeMessage.includes('connection timeout') ||
    causeMessage.includes('connection terminated') ||
    causeMessage.includes('terminated unexpectedly') ||
    causeMessage.includes('timeout exceeded') ||
    causeMessage.includes('timeout exceeded when trying to connect') ||
    causeMessage.includes('pool') ||
    message.includes('timeout waiting for connection') ||
    message.includes('all connection attempts failed') ||
    message.includes('etimedout') ||
    message.includes('econnrefused')
  )
}

export function isPayloadGenericError(error: any): boolean {
  const errorMessage = error?.message || ''
  const errorResponse = error?.response || error?.data || {}

  return (
    errorMessage.includes('Something went wrong') ||
    errorResponse?.errors?.some((e: any) => e?.message?.includes('Something went wrong')) ||
    errorResponse?.message?.includes('Something went wrong') ||
    (typeof errorResponse === 'string' && errorResponse.includes('Something went wrong'))
  )
}
