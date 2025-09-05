'use server';

/**
 * @fileOverview A flow for detecting anomalies in the agricultural supply chain.
 *
 * - detectSupplyChainAnomaly - Function to detect anomalies in the supply chain.
 * - DetectSupplyChainAnomalyInput - Input type for the detectSupplyChainAnomaly function.
 * - DetectSupplyChainAnomalyOutput - Output type for the detectSupplyChainAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSupplyChainAnomalyInputSchema = z.object({
  supplyChainData: z
    .string()
    .describe(
      'The supply chain data, including sourcing, production, distribution, and sales information.'
    ),
  expectedPatterns: z
    .string()
    .optional()
    .describe(
      'Known, normal patterns in the supply chain data, described as a string.'
    ),
});
export type DetectSupplyChainAnomalyInput = z.infer<
  typeof DetectSupplyChainAnomalyInputSchema
>;

const DetectSupplyChainAnomalyOutputSchema = z.object({
  anomalyDetected: z
    .boolean()
    .describe('Whether an anomaly has been detected in the supply chain.'),
  anomalyDescription: z
    .string()
    .describe(
      'A description of the anomaly detected, including the location and possible cause.'
    ),
  riskLevel: z
    .string()
    .describe(
      'The risk level associated with the anomaly (e.g., low, medium, high).'
    ),
  suggestedActions: z
    .string()
    .describe('Suggested actions to mitigate the anomaly.'),
});
export type DetectSupplyChainAnomalyOutput = z.infer<
  typeof DetectSupplyChainAnomalyOutputSchema
>;

export async function detectSupplyChainAnomaly(
  input: DetectSupplyChainAnomalyInput
): Promise<DetectSupplyChainAnomalyOutput> {
  return detectSupplyChainAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSupplyChainAnomalyPrompt',
  input: {schema: DetectSupplyChainAnomalyInputSchema},
  output: {schema: DetectSupplyChainAnomalyOutputSchema},
  prompt: `You are an AI supply chain analyst tasked with detecting anomalies in agricultural supply chains.

  Analyze the following supply chain data to identify any deviations from expected patterns, indications of fraud, waste, or abuse.  Also, consider the expected patterns in your determination of whether or not there is an anomaly.

  Supply Chain Data: {{{supplyChainData}}}

  Expected Patterns: {{{expectedPatterns}}}

  Based on your analysis, determine if there is an anomaly, describe the anomaly, assess the risk level (low, medium, high), and suggest actions to mitigate the anomaly.

  If no anomaly is detected, indicate that no anomaly was detected.
  `,
});

const detectSupplyChainAnomalyFlow = ai.defineFlow(
  {
    name: 'detectSupplyChainAnomalyFlow',
    inputSchema: DetectSupplyChainAnomalyInputSchema,
    outputSchema: DetectSupplyChainAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
