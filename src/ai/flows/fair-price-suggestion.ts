'use server';

/**
 * @fileOverview Provides a fair price suggestion for agricultural produce based on AI analysis.
 *
 * - suggestFairPrice - A function that suggests a fair price for produce.
 * - FairPriceSuggestionInput - The input type for the suggestFairPrice function.
 * - FairPriceSuggestionOutput - The return type for the suggestFairPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FairPriceSuggestionInputSchema = z.object({
  produceType: z.string().describe('The type of agricultural produce (e.g., tomatoes, apples).'),
  quantity: z.number().describe('The quantity of the produce (e.g., 100 kg).'),
  unit: z.string().describe('The unit of measurement for the quantity (e.g., kg, tons).'),
  location: z.string().describe('The current location of the produce.'),
  distributionPath: z
    .string()
    .describe(
      'A description of the distribution path, including transportation methods and intermediaries.'
    ),
  marketData: z
    .string()
    .describe(
      'Market data, including current prices, demand, and supply for the specified produce type.'
    ),
});
export type FairPriceSuggestionInput = z.infer<typeof FairPriceSuggestionInputSchema>;

const FairPriceSuggestionOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe('The suggested fair price for the produce based on the provided data.'),
  currency: z.string().describe('The currency of the suggested price (e.g., USD).'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested price, including factors considered and data sources used.'
    ),
});
export type FairPriceSuggestionOutput = z.infer<typeof FairPriceSuggestionOutputSchema>;

export async function suggestFairPrice(input: FairPriceSuggestionInput): Promise<FairPriceSuggestionOutput> {
  return fairPriceSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fairPriceSuggestionPrompt',
  input: {schema: FairPriceSuggestionInputSchema},
  output: {schema: FairPriceSuggestionOutputSchema},
  prompt: `You are an AI assistant that suggests fair prices for agricultural produce.

  Given the following information, suggest a fair price for the produce:

  Produce Type: {{{produceType}}}
  Quantity: {{{quantity}}} {{{unit}}}
  Location: {{{location}}}
  Distribution Path: {{{distributionPath}}}
  Market Data: {{{marketData}}}

  Consider all factors, including market demand, supply, transportation costs, and intermediaries involved.

  Provide a suggested price, the currency, and a detailed reasoning for your suggestion.

  Format your response as a JSON object with "suggestedPrice", "currency", and "reasoning" fields.`,
});

const fairPriceSuggestionFlow = ai.defineFlow(
  {
    name: 'fairPriceSuggestionFlow',
    inputSchema: FairPriceSuggestionInputSchema,
    outputSchema: FairPriceSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
