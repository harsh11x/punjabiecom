"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface ResponsiveHeroProps {
  title: string
  punjabiTitle: string
  subtitle: string
  description: string
  punjabiDescription: string
  imageSrc: string
  imageAlt: string
  primaryButtonText: string
  secondaryButtonText: string
  primaryButtonHref?: string
  secondaryButtonHref?: string
}

export function ResponsiveHero({
  title,
  punjabiTitle,
  subtitle,
  description,
  punjabiDescription,
  imageSrc,
  imageAlt,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonHref = "#",
  secondaryButtonHref = "#",
}: ResponsiveHeroProps) {
  return (
    <section className="relative py-12 lg:py-24 overflow-hidden">
      {/* Traditional Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23dc2626' fillOpacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3">
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-red-900 hover:from-amber-200 hover:to-orange-200 px-3 lg:px-4 py-1 lg:py-2 text-sm lg:text-lg font-semibold border-2 border-amber-400">
                  ਪੰਜਾਬੀ ਵਿਰਾਸਤ • Punjabi Heritage
                </Badge>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight text-center lg:text-left">
                <span className="text-red-900 drop-shadow-lg">{punjabiTitle}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
                  {title}
                </span>
              </h1>

              <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 lg:p-6 rounded-2xl border-l-4 border-amber-500 shadow-lg">
                <p className="text-lg lg:text-xl text-red-800 leading-relaxed font-medium text-center lg:text-left">
                  {punjabiDescription}
                  <br />
                  <span className="text-amber-800 italic">{description}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
              <Link href={primaryButtonHref}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-800 hover:via-red-700 hover:to-amber-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl border-2 border-amber-400"
                >
                  <span className="mr-2">🛍️</span>
                  {primaryButtonText}
                  <ArrowRight className="ml-2 lg:ml-3 h-5 lg:h-6 w-5 lg:w-6" />
                </Button>
              </Link>
              <Link href={secondaryButtonHref}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-3 border-amber-600 text-red-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 bg-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 shadow-xl font-semibold"
                >
                  <span className="mr-2">📖</span>
                  {secondaryButtonText}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative z-10">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-2xl lg:rounded-3xl opacity-20 blur-lg"></div>
              <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-br from-amber-300 to-red-500 rounded-xl lg:rounded-2xl"></div>
              <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-2xl">
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={imageAlt}
                  width={600}
                  height={700}
                  className="rounded-lg lg:rounded-xl shadow-lg w-full"
                />
              </div>
            </div>

            {/* Floating Decorative Elements - Hidden on mobile */}
            <div className="hidden lg:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-30 animate-pulse"></div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-red-400 to-amber-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="hidden lg:block absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-25 animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
