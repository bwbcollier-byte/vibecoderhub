import { z } from 'zod';

export const submissionSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(3).max(80),
  tagline: z.string().min(10).max(140),
  sourceUrl: z.string().url(),
  description: z.string().min(50).max(2000),
  compatibleClients: z.array(z.string()).min(1),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
