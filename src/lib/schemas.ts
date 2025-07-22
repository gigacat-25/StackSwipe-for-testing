
import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  headline: z.string().min(5, { message: 'Headline must be at least 5 characters.' }),
  bio: z.string().max(280, { message: 'Bio cannot exceed 280 characters.' }).optional(),
  currentWork: z.string().optional(),
  techStack: z.string().optional(),
  interests: z.string().optional(),
  networkingTags: z.array(z.string()).optional(),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
