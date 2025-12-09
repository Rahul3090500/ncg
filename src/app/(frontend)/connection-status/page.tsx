import React from 'react'

async function getConnectionStatus() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ncg-beta.vercel.app'
    const response = await fetch(`${baseUrl}/api/connection-check`, {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch connection status')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching connection status:', error)
    return null
  }
}

export default async function ConnectionStatusPage() {
  const data = await getConnectionStatus()

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connection Status</h1>
          <p className="text-red-600">Failed to fetch connection status</p>
        </div>
      </div>
    )
  }

  const { summary, connections, timestamp } = data

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">RDS Connection Status</h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Connections</div>
              <div className="text-2xl font-bold text-blue-900">{summary.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Active</div>
              <div className="text-2xl font-bold text-green-900">{summary.byState.active || 0}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Idle</div>
              <div className="text-2xl font-bold text-yellow-900">{summary.byState.idle || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Usage</div>
              <div className="text-2xl font-bold text-purple-900">{summary.limits.percentage}</div>
              <div className="text-xs text-purple-600 mt-1">
                {summary.limits.current} / {summary.limits.max}
              </div>
            </div>
          </div>

          {/* Connection Limits */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Limits</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Current Usage</span>
                <span className="text-sm font-medium text-gray-900">
                  {summary.limits.current} / {summary.limits.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${summary.limits.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Available: {summary.limits.available} connections
              </div>
            </div>
          </div>

          {/* Connections by Application */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connections by Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summary.byApplication).map(([app, count]) => (
                <div key={app} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">{app}</div>
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-1">connection(s)</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Connections */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Connections</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {connections.map((conn: any, index: number) => (
                    <tr key={index} className={conn.state === 'active' ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conn.pid}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {conn.application}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {conn.clientAddress}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            conn.state === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {conn.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {conn.backendAge || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-6 text-sm text-gray-500 text-center">
            Last updated: {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

