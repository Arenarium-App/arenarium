'use client'

import { useState } from 'react'
import { Filter, DollarSign } from 'lucide-react'

export function ItemsFilters() {
  const [priceRange, setPriceRange] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-1000', label: '0 - 1,000 Gold' },
    { value: '1000-3000', label: '1,000 - 3,000 Gold' },
    { value: '3000-5000', label: '3,000 - 5,000 Gold' },
    { value: '5000+', label: '5,000+ Gold' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="block truncate">
              {priceRanges.find(range => range.value === priceRange)?.label || 'All Prices'}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setPriceRange(range.value)
                    setIsOpen(false)
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters */}
      {priceRange !== 'all' && (
        <button
          onClick={() => setPriceRange('all')}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
