'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

import {
  detectSupplyChainAnomaly,
  type DetectSupplyChainAnomalyOutput,
} from '@/ai/flows/anomaly-detection-alert';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  supplyChainData: z.string().min(20, { message: 'Supply chain data is required.' }),
  expectedPatterns: z.string().optional(),
});

export function AnomalyClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectSupplyChainAnomalyOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplyChainData: '',
      expectedPatterns: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const anomalyReport = await detectSupplyChainAnomaly(values);
      setResult(anomalyReport);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to run anomaly detection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getRiskBadgeVariant = (riskLevel: string | undefined) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Supply Chain Anomaly Detection</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Data</CardTitle>
            <CardDescription>
              Input supply chain data to detect potential anomalies like fraud, waste, or abuse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplyChainData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Chain Data</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide sourcing, production, distribution, and sales information..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedPatterns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Patterns (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe normal patterns, e.g., 'delivery from farm to warehouse takes 2 days'."
                          className="min-h-[100px]"
                          {...field}
                        />
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
                  Detect Anomalies
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Report</CardTitle>
              <CardDescription>The anomaly report will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {result && (
                result.anomalyDetected ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className='flex items-center gap-2'>
                      Anomaly Detected
                      <Badge variant={getRiskBadgeVariant(result.riskLevel)}>{result.riskLevel}</Badge>
                    </AlertTitle>
                    <AlertDescription className="space-y-4 mt-2">
                      <div>
                        <p className="font-semibold">Description</p>
                        <p>{result.anomalyDescription}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Suggested Actions</p>
                        <p>{result.suggestedActions}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>No Anomaly Detected</AlertTitle>
                    <AlertDescription>
                      {result.anomalyDescription || 'The supply chain data appears to be within normal parameters.'}
                    </AlertDescription>
                  </Alert>
                )
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-10">
                  <p>Your anomaly report will be shown here once generated.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
