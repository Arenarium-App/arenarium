import { Suspense } from 'react'
import { ItemsList } from '@/components/ItemsList'
import { ItemsFilters } from '@/components/ItemsFilters'

export default function ItemsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Items</h1>
        <p className="mt-2 text-gray-600">
          Browse Mobile Legends items and their effects
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <ItemsFilters />
        </div>

        {/* Items List */}
        <div className="lg:w-3/4">
          <Suspense fallback={<ItemsListSkeleton />}>
            <ItemsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ItemsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
