'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface SizeSelectorProps {
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
  label?: string
  required?: boolean
}

const UK_SIZES = [
  'UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5',
  'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'
]

export default function SizeSelector({ 
  selectedSizes, 
  onSizesChange, 
  label = "Available Sizes",
  required = false 
}: SizeSelectorProps) {
  const handleSizeToggle = (size: string) => {
    const isSelected = selectedSizes.includes(size)
    
    if (isSelected) {
      // Remove size
      onSizesChange(selectedSizes.filter(s => s !== size))
    } else {
      // Add size
      onSizesChange([...selectedSizes, size])
    }
  }

  const handleSelectAll = () => {
    if (selectedSizes.length === UK_SIZES.length) {
      // Deselect all
      onSizesChange([])
    } else {
      // Select all
      onSizesChange([...UK_SIZES])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {selectedSizes.length === UK_SIZES.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {UK_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size)
          return (
            <div
              key={size}
              className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => handleSizeToggle(size)}
            >
              <Checkbox
                id={`size-${size}`}
                checked={isSelected}
                onChange={() => handleSizeToggle(size)}
                className="pointer-events-none"
              />
              <Label 
                htmlFor={`size-${size}`}
                className="text-sm font-medium cursor-pointer pointer-events-none"
              >
                {size}
              </Label>
            </div>
          )
        })}
      </div>
      
      {selectedSizes.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Selected sizes: {selectedSizes.join(', ')}
          </p>
        </div>
      )}
      
      {required && selectedSizes.length === 0 && (
        <p className="text-sm text-red-500">
          Please select at least one size
        </p>
      )}
    </div>
  )
}
