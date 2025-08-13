'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Star, 
  Users, 
  Globe, 
  Scissors, 
  Palette,
  Crown,
  Award,
  BookOpen,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react'

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-xl">
                <span className="text-white font-bold text-3xl drop-shadow-lg">ਪ</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              <span className="text-amber-200">ਸਾਡੀ ਕਹਾਣੀ</span>
              <br />
              <span className="text-white">Our Story</span>
            </h1>
            <p className="text-xl lg:text-2xl text-amber-100 mb-8 leading-relaxed">
              A journey through centuries of Punjabi craftsmanship, preserving the rich heritage 
              of traditional jutti and phulkari artistry for generations to come.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-500 text-red-900 font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Since 1947
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-500 text-red-900 font-semibold">
                <Users className="w-4 h-4 mr-2" />
                100+ Artisans
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-500 text-red-900 font-semibold">
                <Globe className="w-4 h-4 mr-2" />
                Worldwide Heritage
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Origins Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-red-600" />
                  <h2 className="text-3xl lg:text-4xl font-bold text-red-900">
                    ਮੂਲ ਅਤੇ ਇਤਿਹਾਸ
                    <br />
                    <span className="text-amber-700">Origins & History</span>
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-lg leading-relaxed mb-4">
                    Punjab Heritage was born from a passion to preserve the exquisite artistry of Punjab's 
                    traditional crafts. Our story begins in the vibrant villages of Punjab, where master 
                    artisans have been creating intricate jutti and phulkari for centuries.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    <strong>Jutti</strong> - These beautiful leather shoes, adorned with intricate embroidery 
                    and mirror work, have been worn by Punjabi royalty and common people alike since the 
                    Mughal era. Each pair tells a story of craftsmanship passed down through generations.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong>Phulkari</strong> - Literally meaning "flower work," this traditional embroidery 
                    technique transforms simple fabric into vibrant masterpieces. Originally created by 
                    Punjabi women as gifts of love for their daughters and daughters-in-law.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-red-600/20 rounded-3xl transform rotate-6"></div>
                <Card className="relative border-4 border-amber-200 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-red-900 mb-2">Royal Heritage</h3>
                        <p className="text-sm text-gray-600">Worn by Maharajas and Queens of Punjab</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Scissors className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-red-900 mb-2">Handcrafted</h3>
                        <p className="text-sm text-gray-600">Every piece meticulously crafted by hand</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Palette className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-red-900 mb-2">Vibrant Colors</h3>
                        <p className="text-sm text-gray-600">Rich colors inspired by Punjab's landscape</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-red-900 mb-2">Love & Tradition</h3>
                        <p className="text-sm text-gray-600">Created with love, worn with pride</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-red-900 mb-6">
                ਦਸਤਕਾਰੀ ਦੀ ਪ੍ਰਕਿਰਿਆ
                <br />
                <span className="text-amber-700">The Art of Craftsmanship</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Each piece in our collection is the result of weeks of meticulous handwork, 
                combining traditional techniques with contemporary designs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Design Creation",
                  punjabi: "ਡਿਜ਼ਾਈਨ ਬਣਾਉਣਾ",
                  description: "Master artisans sketch intricate patterns inspired by Punjab's flora, fauna, and cultural motifs.",
                  icon: BookOpen
                },
                {
                  step: "2", 
                  title: "Material Selection",
                  punjabi: "ਸਮੱਗਰੀ ਦੀ ਚੋਣ",
                  description: "Premium leather for jutti and finest cotton/silk fabrics for phulkari are carefully selected.",
                  icon: Award
                },
                {
                  step: "3",
                  title: "Hand Embroidery",
                  punjabi: "ਹੱਥ ਕਢਾਈ",
                  description: "Skilled artisans spend days creating intricate embroidery using silk threads and metallic work.",
                  icon: Scissors
                },
                {
                  step: "4",
                  title: "Final Assembly",
                  punjabi: "ਅੰਤਮ ਜੋੜ",
                  description: "Each piece is carefully assembled, quality checked, and blessed before reaching you.",
                  icon: Sparkles
                }
              ].map((process) => (
                <Card key={process.step} className="border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <process.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="mb-3 bg-amber-500 text-red-900 font-bold">
                      Step {process.step}
                    </Badge>
                    <h3 className="font-bold text-red-900 mb-2">{process.title}</h3>
                    <p className="text-sm text-amber-700 font-medium mb-3">{process.punjabi}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {process.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Significance */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-amber-600/20 rounded-3xl transform -rotate-6"></div>
                <div className="relative bg-white rounded-3xl border-4 border-red-200 shadow-2xl p-8">
                  <h3 className="text-2xl font-bold text-red-900 mb-6 text-center">
                    ਸੱਭਿਆਚਾਰਕ ਮਹੱਤਵ
                    <br />
                    Cultural Significance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-900">Regional Identity</h4>
                        <p className="text-sm text-gray-600">Each region of Punjab has its unique style and pattern variations.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Heart className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-900">Emotional Connection</h4>
                        <p className="text-sm text-gray-600">These crafts carry deep emotional significance in Punjabi families.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Users className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-900">Community Bonding</h4>
                        <p className="text-sm text-gray-600">Traditional crafts bring communities together in celebration.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Globe className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-900">Global Recognition</h4>
                        <p className="text-sm text-gray-600">Punjab's crafts are celebrated worldwide for their beauty and quality.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-amber-500" />
                  <h2 className="text-3xl lg:text-4xl font-bold text-red-900">
                    ਸੱਭਿਆਚਾਰ ਦਾ ਖਜ਼ਾਨਾ
                    <br />
                    <span className="text-amber-700">Treasure of Culture</span>
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-lg leading-relaxed mb-4">
                    In Punjab, traditional crafts are not merely decorative items – they are living symbols 
                    of cultural identity, passed down through generations with stories, songs, and celebrations.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-4">
                    Every bride receives phulkari dupatta as a blessing from her mother, and every groom 
                    wears jutti as a symbol of his heritage. These crafts connect us to our roots and 
                    carry forward the essence of Punjab's rich cultural legacy.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-6">
                    At Punjab Heritage, we don't just sell products – we share stories, preserve traditions, 
                    and ensure that the magnificent art of Punjabi craftsmanship continues to flourish 
                    in the modern world.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold py-3 px-6"
                  >
                    <Link href="/products">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explore Our Collection
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 px-6"
                  >
                    <Link href="/about">
                      <Users className="w-5 h-5 mr-2" />
                      Meet Our Artisans
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              ਸਾਡੇ ਨਾਲ ਜੁੜੋ
              <br />
              <span className="text-amber-200">Join Our Heritage Journey</span>
            </h2>
            <p className="text-xl text-amber-100 mb-8 leading-relaxed">
              Be part of preserving Punjab's magnificent craft traditions. 
              Every purchase supports our artisan community and keeps these beautiful arts alive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-amber-500 text-red-900 hover:bg-amber-400 font-bold py-4 px-8"
              >
                <Link href="/jutti">
                  Discover Jutti Collection
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-amber-300 text-amber-100 hover:bg-amber-300 hover:text-red-900 font-bold py-4 px-8"
              >
                <Link href="/phulkari">
                  Explore Phulkari Art
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
