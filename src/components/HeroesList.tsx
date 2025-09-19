'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Zap } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Hero = Database['public']['Tables']['heroes']['Row']

export function HeroesList() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchHeroes() {
      try {
        const { data, error } = await supabase
          .from('heroes')
          .select('*')
          .order('hero_name')

        if (error) {
          throw error
        }

        setHeroes(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch heroes')
      } finally {
        setLoading(false)
      }
    }

    fetchHeroes()
  }, [supabase])

  if (loading) {
    return <HeroesListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading heroes: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (heroes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No heroes found.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {heroes.map((hero) => (
        <Link
          key={hero.id}
          href={`/heroes/${hero.id}`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex-shrink-0">
              {hero.hero_img ? (
                <Image
                  src={hero.hero_img}
                  alt={hero.hero_name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {hero.hero_name}
              </h3>
              <div className="flex items-center justify-center mt-2">
                <Zap className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">{hero.hero_role}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function HeroesListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="text-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
