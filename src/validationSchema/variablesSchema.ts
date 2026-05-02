// validationSchema/variablesSchema.ts
import { z } from "zod";

export const variablesSchema = z.object({
  section: z.array(z.string()),
  catergory: z.array(z.string()),
  subCatergory: z.record(z.string(), z.array(z.string())),
  color: z.array(z.string()),
  occassion: z.array(z.string()),
  patternAndPrint: z.array(z.string()),
  style: z.array(z.string()),
  sizes: z.array(z.string()),
  fabric: z.array(z.string()),
  option: z.array(z.string()),
});

export type variablesFormValues = z.infer<typeof variablesSchema>;
