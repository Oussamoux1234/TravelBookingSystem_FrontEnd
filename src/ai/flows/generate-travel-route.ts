'use server';

/**
 * @fileOverview A travel route generation AI agent.
 *
 * - generateTravelRoute - A function that generates a travel route.
 * - GenerateTravelRouteInput - The input type for the generateTravelRoute function.
 * - GenerateTravelRouteOutput - The return type for the generateTravelRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTravelRouteInputSchema = z.object({
  origin: z.string().describe('The starting point of the route.'),
  destination: z.string().describe('The end point of the route.'),
  preferences: z.string().optional().describe('The user preferences for the route, such as preferred mode of transport, types of restaurants, and local interests.'),
});
export type GenerateTravelRouteInput = z.infer<typeof GenerateTravelRouteInputSchema>;

const GenerateTravelRouteOutputSchema = z.object({
  route: z.string().describe('The generated travel route.'),
});
export type GenerateTravelRouteOutput = z.infer<typeof GenerateTravelRouteOutputSchema>;

export async function generateTravelRoute(input: GenerateTravelRouteInput): Promise<GenerateTravelRouteOutput> {
  return generateTravelRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTravelRoutePrompt',
  input: {schema: GenerateTravelRouteInputSchema},
  output: {schema: GenerateTravelRouteOutputSchema},
  prompt: `You are an expert travel assistant. You generate travel routes between two locations, taking into account real-time transport data, restaurants, and local preferences.

  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Preferences: {{{preferences}}}

  Generate a detailed travel route:
  `,
});

const generateTravelRouteFlow = ai.defineFlow(
  {
    name: 'generateTravelRouteFlow',
    inputSchema: GenerateTravelRouteInputSchema,
    outputSchema: GenerateTravelRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
