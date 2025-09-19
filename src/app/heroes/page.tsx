import { Suspense } from 'react'
import { HeroesList } from '@/components/HeroesList'
import { HeroesFilters } from '@/components/HeroesFilters'

export default function HeroesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Heroes</h1>
        <p className="mt-2 text-gray-600">
          Discover Mobile Legends heroes and their abilities
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <HeroesFilters />
        </div>

        {/* Heroes List */}
        <div className="lg:w-3/4">
          <Suspense fallback={<HeroesListSkeleton />}>
            <HeroesList />
          </Suspense>
        </div>
      </div>
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
