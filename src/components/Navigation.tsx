'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Trophy, Users, Gamepad2, Shield, Zap, ChevronDown, BarChart3, Settings } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'

const navigation = [
  { name: 'Home', href: '/', icon: Trophy },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Players', href: '/players', icon: Gamepad2 },
  { name: 'Heroes', href: '/heroes', icon: Shield },
  { name: 'Items', href: '/items', icon: Zap },
  { name: 'Matches', href: '/matches', icon: Trophy },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Settings },
  { name: 'Team Management', href: '/admin/teams', icon: Users },
  { name: 'Tournament Formats', href: '/admin/tournament-formats', icon: Trophy },
]

const games = [
  { 
    name: 'Mobile Legends', 
    code: 'mlbb', 
    status: 'live',
    href: '/',
    description: 'Mobile Legends: Bang Bang'
  },
  { 
    name: 'Valorant', 
    code: 'valorant', 
    status: 'coming-soon',
    href: '#',
    description: 'Agents, maps, and competitive scene'
  },
  { 
    name: 'League of Legends', 
    code: 'lol', 
    status: 'planned',
    href: '#',
    description: 'Champions, teams, and tournaments'
  },
  { 
    name: 'Dota 2', 
    code: 'dota2', 
    status: 'planned',
    href: '#',
    description: 'Heroes, strategies, and competitive play'
  },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [gameMenuOpen, setGameMenuOpen] = useState(false)
  const pathname = usePathname()

  const currentGame = games.find(game => game.status === 'live') || games[0]

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Arenarium</span>
              </Link>
            </div>

            {/* Game Selector */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <button
                  onClick={() => setGameMenuOpen(!gameMenuOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {currentGame.name}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>

                {gameMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {games.map((game) => (
                        <Link
                          key={game.code}
                          href={game.href}
                          className={`flex items-center px-4 py-2 text-sm ${
                            game.status === 'live' 
                              ? 'text-gray-700 hover:bg-gray-100' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={(e) => {
                            if (game.status !== 'live') {
                              e.preventDefault()
                            } else {
                              setGameMenuOpen(false)
                            }
                          }}
                        >
                          <span className={`w-2 h-2 rounded-full mr-3 ${
                            game.status === 'live' ? 'bg-green-400' : 'bg-gray-300'
                          }`}></span>
                          <div>
                            <div className="font-medium">{game.name}</div>
                            <div className="text-xs text-gray-500">{game.description}</div>
                          </div>
                          {game.status !== 'live' && (
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              {game.status === 'coming-soon' ? 'Soon' : 'Planned'}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-purple-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Game Selector for Mobile */}
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Current Game</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-700">{currentGame.name}</span>
                </span>
              </div>
            </div>
            
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-purple-50 border-purple-400 text-purple-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
