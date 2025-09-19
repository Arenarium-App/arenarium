'use client'

import Link from 'next/link'
import { 
  Image as ImageIcon, 
  Users, 
  Trophy, 
  Gamepad2, 
  Shield, 
  Zap, 
  Settings,
  ArrowRight,
  Database,
  Upload
} from 'lucide-react'

const adminFeatures = [
  {
    title: 'Team Logo Management',
    description: 'Upload and update team logos that appear throughout the site',
    href: '/admin/teams',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    status: 'ready'
  },
  {
    title: 'Image Upload Testing',
    description: 'Test image uploads for various content types (heroes, items, etc.)',
    href: '/admin/images',
    icon: ImageIcon,
    color: 'from-green-500 to-green-600',
    status: 'ready'
  },
  {
    title: 'Tournament Management',
    description: 'Create and manage tournaments, brackets, and schedules',
    href: '/admin/tournaments',
    icon: Trophy,
    color: 'from-purple-500 to-purple-600',
    status: 'coming-soon'
  },
  {
    title: 'Tournament Format Manager',
    description: 'Configure tournament formats, stages, and bracket structures',
    href: '/admin/tournament-formats',
    icon: Trophy,
    color: 'from-indigo-500 to-indigo-600',
    status: 'ready'
  },
  {
    title: 'Tournament Team Management',
    description: 'Add, remove, and manage participating teams for tournaments',
    href: '/admin/tournament-teams',
    icon: Users,
    color: 'from-emerald-500 to-emerald-600',
    status: 'ready'
  },
  {
    title: 'Tournament Management',
    description: 'Manage individual tournaments, teams, brackets, and settings',
    href: '/admin/tournaments',
    icon: Trophy,
    color: 'from-blue-500 to-blue-600',
    status: 'ready'
  },
  {
    title: 'Player Management',
    description: 'Manage player profiles, photos, and team assignments',
    href: '/admin/players',
    icon: Gamepad2,
    color: 'from-orange-500 to-orange-600',
    status: 'coming-soon'
  },
  {
    title: 'Hero Management',
    description: 'Add and update hero information, images, and skills',
    href: '/admin/heroes',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    status: 'coming-soon'
  },
  {
    title: 'Item Management',
    description: 'Manage in-game items, prices, and images',
    href: '/admin/items',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    status: 'coming-soon'
  }
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Supabase Connected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Arenarium Admin
          </h2>
          <p className="text-gray-600 max-w-3xl">
            Manage your esports platform content, upload images, and keep your database 
            up to date. Start with team logos to make your site look professional.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Database Status</p>
                <p className="text-2xl font-semibold text-gray-900">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Status</p>
                <p className="text-2xl font-semibold text-gray-900">Ready</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teams</p>
                <p className="text-2xl font-semibold text-gray-900">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tournaments</p>
                <p className="text-2xl font-semibold text-gray-900">Live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-200 ${
                feature.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={(e) => {
                if (feature.status === 'coming-soon') {
                  e.preventDefault()
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  {feature.status === 'coming-soon' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                {feature.status === 'ready' && (
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Getting Started */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">🚀 Getting Started</h3>
          <div className="text-purple-800 text-sm space-y-2">
            <p>1. <strong>Start with Team Logos</strong> - Upload team logos to replace placeholder images</p>
            <p>2. <strong>Test Image Uploads</strong> - Verify your Supabase storage is working correctly</p>
            <p>3. <strong>View Public Site</strong> - Check how your content appears to visitors</p>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/teams"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              Start with Team Logos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
