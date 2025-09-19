'use client'

import { useState } from 'react'
import TeamLogoManager from '@/components/TeamLogoManager'
import { ArrowLeft, Users, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function AdminTeamsPage() {
  const [logoUpdateCount, setLogoUpdateCount] = useState(0)

  const handleLogoUpdated = (teamId: number, newLogoUrl: string) => {
    setLogoUpdateCount(prev => prev + 1)
    console.log(`Team ${teamId} logo updated to: ${newLogoUrl}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">Team Management</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {logoUpdateCount} logo{logoUpdateCount !== 1 ? 's' : ''} updated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Description */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ImageIcon className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Team Logo Management</h2>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Update team logos that will be displayed throughout the site. Upload new images 
            to replace placeholder logos and make your teams look professional.
          </p>
        </div>

        {/* Team Logo Manager */}
        <TeamLogoManager onLogoUpdated={handleLogoUpdated} />

        {/* Quick Actions */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/teams"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">View Public Teams</div>
                <div className="text-sm text-gray-500">See how teams appear to visitors</div>
              </div>
            </Link>
            
            <Link
              href="/admin/images"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Image Upload Test</div>
                <div className="text-sm text-gray-500">Test image uploads for other content</div>
              </div>
            </Link>
            
            <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-5 h-5 text-gray-400 mr-3">📊</div>
              <div>
                <div className="font-medium text-gray-900">Analytics</div>
                <div className="text-sm text-gray-500">Coming soon - logo usage stats</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
