'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import {
  suggestFairPrice,
  type FairPriceSuggestionOutput,
} from '@/ai/flows/fair-price-suggestion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  produceType: z.string().min(2, { message: 'Produce type is required.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be a positive number.' }),
  unit: z.string().min(1, { message: 'Unit is required.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  distributionPath: z.string().min(10, { message: 'Please describe the distribution path.' }),
  marketData: z.string().min(10, { message: 'Please provide some market data.' }),
});

export function FairPriceClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FairPriceSuggestionOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produceType: '',
      quantity: 100,
      unit: 'kg',
      location: '',
      distributionPath: '',
      marketData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestFairPrice(values);
      setResult(suggestion);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get fair price suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Fair Price Calculator</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Enter the details of your produce to get an AI-powered fair price suggestion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="produceType"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Produce Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Organic Tomatoes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., California, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="distributionPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribution Path</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the journey from farm to market..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Data</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Current prices, demand, supply info..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Calculate Fair Price
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestion</CardTitle>
              <CardDescription>The suggested fair price will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {result && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Suggested Price</p>
                    <p className="text-4xl font-bold">
                      {result.suggestedPrice.toFixed(2)}{' '}
                      <span className="text-2xl text-muted-foreground">{result.currency}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reasoning</p>
                    <p className="text-base">{result.reasoning}</p>
                  </div>
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-10">
                  <p>Your price suggestion will be shown here once calculated.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
