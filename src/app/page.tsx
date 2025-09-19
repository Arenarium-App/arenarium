import Link from 'next/link'
import { Trophy, Users, Gamepad2, Shield, Zap, TrendingUp, Calendar, Target, Globe, BarChart3, Play } from 'lucide-react'

const stats = [
  { name: 'Total Teams', value: '150+', icon: Users },
  { name: 'Active Players', value: '2000+', icon: Gamepad2 },
  { name: 'Tournaments', value: '50+', icon: Trophy },
  { name: 'Matches Played', value: '1000+', icon: Play },
]

const featuredSections = [
  {
    name: 'Tournaments',
    description: 'Browse competitive tournaments and championships',
    href: '/tournaments',
    icon: Trophy,
    color: 'bg-yellow-500',
  },
  {
    name: 'Matches',
    description: 'View live and upcoming matches',
    href: '/matches',
    icon: Play,
    color: 'bg-red-500',
  },
  {
    name: 'Teams',
    description: 'Browse competitive teams and their achievements',
    href: '/teams',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    name: 'Players',
    description: 'Explore player profiles and statistics',
    href: '/players',
    icon: Gamepad2,
    color: 'bg-green-500',
  },
  {
    name: 'Statistics',
    description: 'Analytics and performance metrics',
    href: '/statistics',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    name: 'Heroes',
    description: 'Discover heroes and their abilities',
    href: '/heroes',
    icon: Shield,
    color: 'bg-indigo-500',
  },
]

const upcomingGames = [
  {
    name: 'Valorant',
    description: 'Agents, maps, and competitive scene',
    status: 'Coming Soon',
    icon: Target,
    color: 'bg-red-500',
  },
  {
    name: 'League of Legends',
    description: 'Champions, teams, and tournaments',
    status: 'Coming Soon',
    icon: Globe,
    color: 'bg-blue-500',
  },
  {
    name: 'Dota 2',
    description: 'Heroes, strategies, and competitive play',
    status: 'Coming Soon',
    icon: Shield,
    color: 'bg-orange-500',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Arenarium
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          The ultimate multi-game competitive gaming wiki and database. 
          Currently featuring <strong>Mobile Legends: Bang Bang</strong> with 
          plans to expand to <strong>Valorant</strong>, <strong>League of Legends</strong>, and more.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✅ Mobile Legends: Bang Bang (Live)
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            🚧 Valorant (Coming Soon)
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            📋 More Games (Planned)
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6 mb-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6 text-center">
            <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
          </div>
        ))}
      </div>

      {/* Featured Sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Mobile Legends</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`${section.color} rounded-lg p-3 mr-4`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                    {section.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Games Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {upcomingGames.map((game) => (
            <div
              key={game.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className={`${game.color} rounded-lg p-3 mr-4`}>
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {game.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{game.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                EVOS Legends wins MPL ID Season 12
              </p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                New team &quot;Team Flash&quot; joins the competitive scene
              </p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Player &quot;Lemon&quot; achieves 1000th win milestone
              </p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

