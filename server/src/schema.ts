
import { z } from 'zod';

// UI Configuration schema
export const uiConfigSchema = z.object({
  buttonText: z.string(),
  buttonColor: z.string(),
  buttonAction: z.string().nullable() // Nullable since the button performs no action
});

export type UIConfig = z.infer<typeof uiConfigSchema>;
