'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, DollarSign } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Item = Database['public']['Tables']['items']['Row']

export function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('item_name')

        if (error) {
          throw error
        }

        setItems(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [supabase])

  if (loading) {
    return <ItemsListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading items: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No items found.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/items/${item.id}`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {item.item_img ? (
                <Image
                  src={item.item_img}
                  alt={item.item_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.item_name}
              </h3>
              <div className="flex items-center mt-1">
                <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">{item.price} Gold</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
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
