import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart, CheckCircle, QrCode, Search, Tractor } from 'lucide-react';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const features = [
    {
      icon: <Tractor className="h-10 w-10 text-accent" />,
      title: 'Product Origin Tracking',
      description: 'Trace agricultural produce from farm to consumer with blockchain-powered transparency.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-accent" />,
      title: 'Transaction Verification',
      description: 'Stakeholders can verify transactions, ensuring fair pricing and maintaining quality standards.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-accent" />,
      title: 'Fair Price Calculation',
      description: 'Utilize AI to analyze market data and suggest fair prices for produce, benefiting all parties.',
    },
    {
      icon: <Search className="h-10 w-10 text-accent" />,
      title: 'Anomaly Detection',
      description: 'AI-driven monitoring of the supply chain to detect fraud, waste, and abuse effectively.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="h-56 bg-gradient-to-br from-primary/50 to-green-300 blur-3xl dark:from-blue-700"></div>
            <div className="h-32 bg-gradient-to-r from-accent/50 to-yellow-400 blur-3xl dark:from-indigo-600"></div>
          </div>
          <div className="container relative mx-auto px-6 text-center">
            <h1 className="text-4xl font-headline font-bold text-foreground md:text-6xl">
              Trace Your Food, <span className="text-primary">Trust Your Roots</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
              TruCrop brings unparalleled transparency to the agricultural supply chain using blockchain technology. Empowering farmers, distributors, and consumers with verifiable data.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">
                  Explore Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-card/50">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold md:text-4xl">Why TruCrop?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A new era of trust and efficiency in agriculture.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-background border-border/60">
                  <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-headline font-bold md:text-4xl">Simple Access with a <span className="text-primary">QR Scan</span></h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Consumers can instantly access detailed product information, from farm to shelf, simply by scanning a QR code. This creates a direct connection to the food's origin and journey.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <Input placeholder="Enter Product ID or Scan QR" className="max-w-sm" />
                  <Button>
                    <Search className="mr-2 h-4 w-4" /> Track
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <div className="relative w-64 h-64 p-6 bg-white rounded-lg shadow-lg">
                  <QrCode className="w-full h-full text-gray-800" />
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs font-semibold text-gray-600">Scan to discover the story</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
