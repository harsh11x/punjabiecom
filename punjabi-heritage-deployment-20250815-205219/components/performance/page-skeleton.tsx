export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 animate-pulse">
      {/* Header skeleton */}
      <div className="border-b-4 border-amber-600 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-12 lg:w-16 h-12 lg:h-16 bg-amber-400/50 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-amber-100/30 rounded w-32"></div>
                <div className="h-4 bg-white/20 rounded w-28"></div>
              </div>
            </div>
            <div className="hidden lg:flex space-x-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-amber-100/30 rounded w-16"></div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-100/30 rounded-full"></div>
              <div className="w-10 h-10 bg-amber-100/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero section skeleton */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-red-200 rounded w-3/4"></div>
              <div className="h-12 bg-amber-200 rounded w-full"></div>
              <div className="h-6 bg-red-100 rounded w-5/6"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 bg-red-300 rounded w-32"></div>
              <div className="h-12 bg-amber-300 rounded w-28"></div>
            </div>
          </div>
          <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-red-200 rounded-xl"></div>
        </div>

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-red-200 rounded w-3/4"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-amber-100/30 rounded w-24"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-white/20 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
