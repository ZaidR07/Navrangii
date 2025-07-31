// validationSchema/variablesSchema.ts
import { z } from "zod";

export const variablesSchema = z.object({
  catergory: z.array(z.string()),
  subCatergory: z.array(z.string()),
  color: z.array(z.string()),
  occassion: z.array(z.string()),
  patternAndPrint: z.array(z.string()),
  style: z.array(z.string()),
  sizes: z.array(z.string()),
  fabric: z.array(z.string()),
  option: z.array(z.string()), // ✅ ADD THIS LINE
});

export type variablesFormValues = z.infer<typeof variablesSchema>;
