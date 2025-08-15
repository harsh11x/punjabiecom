"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

interface MobileFiltersProps {
  children: React.ReactNode
}

export function MobileFilters({ children }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold py-3 shadow-lg border-2 border-amber-300"
        >
          <Filter className="h-5 w-5 mr-2" />
          ਫਿਲਟਰ ਅਤੇ ਕ੍ਰਮ • Filters & Sort
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">{children}</div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Filter Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-red-900">ਫਿਲਟਰ ਅਤੇ ਕ੍ਰਮ • Filters & Sort</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Filter Content */}
            <div className="p-6">
              <div className="space-y-6">{children}</div>

              {/* Apply Button */}
              <div className="mt-8 pt-6 border-t border-amber-200">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-semibold py-3 shadow-lg"
                >
                  ਲਾਗੂ ਕਰੋ • Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
