'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Team = Database['public']['Tables']['teams']['Row']

export function TeamsFilters() {
  const [regions, setRegions] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchRegions() {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('region')
          .order('region')

        if (error) {
          console.error('Error fetching regions:', error)
          return
        }

        const uniqueRegions = [...new Set(data?.map(team => team.region) || [])]
        setRegions(uniqueRegions)
      } catch (err) {
        console.error('Failed to fetch regions:', err)
      }
    }

    fetchRegions()
  }, [supabase])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Region
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="block truncate">
              {selectedRegion === 'all' ? 'All Regions' : selectedRegion}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSelectedRegion('all')
                  setIsOpen(false)
                }}
              >
                All Regions
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setSelectedRegion(region)
                    setIsOpen(false)
                  }}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {selectedRegion !== 'all' && (
        <button
          onClick={() => setSelectedRegion('all')}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
