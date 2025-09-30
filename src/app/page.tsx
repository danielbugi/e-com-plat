import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  HeadphonesIcon,
  Gem,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/product-card';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    include: {
      category: true,
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Serialize Decimal to number
  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
  }));
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-steel">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-primary-foreground">
              <h6 className="text-accent uppercase tracking-widest text-sm font-semibold">
                Premium Men's Jewelry
              </h6>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Forge Your Legacy with Timeless Elegance
              </h1>
              <p className="text-xl text-muted-foreground">
                Handcrafted rings and jewelry designed for the modern gentleman
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  asChild
                >
                  <Link href="/shop">
                    Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white"
                  asChild
                >
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] hidden md:flex items-center justify-center">
              <div className="relative">
                <Gem className="h-64 w-64 text-accent opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-accent/10 backdrop-blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On orders over ₪500
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Lifetime Warranty
                </h3>
                <p className="text-sm text-muted-foreground">
                  On all craftsmanship
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Handcrafted excellence
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Personal consultation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground text-lg">
                Handpicked pieces that define excellence
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">View All</Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No featured products available
            </p>
          )}
        </div>
      </section>

      {/* Collections Preview */}
      <section className="py-20 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop by Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our signature pieces, each telling a unique story of
              craftsmanship and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/shop?category=signature-rings" className="group">
              <div className="relative overflow-hidden rounded-lg h-96 cursor-pointer">
                <Image
                  src="/images/ring-1.jpg"
                  alt="Signature Rings Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Signature Rings</h3>
                  <p className="text-steel-300 mb-4">
                    Bold statements of character
                  </p>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=wedding-bands" className="group">
              <div className="relative overflow-hidden rounded-lg h-96 cursor-pointer">
                <Image
                  src="/images/ring-2.jpg"
                  alt="Wedding Bands Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Wedding Bands</h3>
                  <p className="text-steel-300 mb-4">
                    Timeless symbols of commitment
                  </p>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=custom-pieces" className="group">
              <div className="relative overflow-hidden rounded-lg h-96 cursor-pointer">
                <Image
                  src="/images/ring-3.jpg"
                  alt="Custom Pieces Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Custom Pieces</h3>
                  <p className="text-steel-300 mb-4">Your vision, our craft</p>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-steel text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">
                Our Craft
              </h6>
              <h2 className="text-4xl font-bold mb-6">
                Masterfully Crafted for the Modern Man
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Each piece is meticulously handcrafted by skilled artisans,
                combining traditional techniques with contemporary design.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative h-[500px] bg-secondary/10 rounded-lg flex items-center justify-center">
              <Gem className="h-48 w-48 text-accent opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gold">
        <div className="container px-4 mx-auto text-center">
          <h6 className="uppercase text-sm mb-4 font-semibold tracking-widest text-accent-foreground">
            Gift Card
          </h6>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent-foreground">
            Give the Gift of Distinction
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-accent-foreground/80">
            Perfect for the discerning gentleman in your life
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Purchase A Gift Card
          </Button>
        </div>
      </section>
    </div>
  );
}
