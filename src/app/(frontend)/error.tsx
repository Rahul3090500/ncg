'use client'

import React from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const isDatabaseError = 
    error.message?.toLowerCase().includes('database') ||
    error.message?.toLowerCase().includes('connection') ||
    error.message?.toLowerCase().includes('rds') ||
    error.digest?.includes('53300') ||
    error.message?.includes('remaining connection slots')

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-manrope-semibold text-[#000F19] mb-4">
            {isDatabaseError ? 'Database Connection Error' : 'Something went wrong'}
          </h1>
          <p className="text-lg text-[#000F19B2] mb-8">
            {isDatabaseError 
              ? 'The database connection pool is currently unavailable. Please try reloading the page.'
              : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-[#000F19] text-white font-manrope-medium rounded-lg hover:bg-[#001D5C] transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-white text-[#000F19] font-manrope-medium border-2 border-[#000F19] rounded-lg hover:bg-[#000F19] hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm font-mono text-gray-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

