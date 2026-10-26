import { z } from "zod";

// Preserve arbitrary values under string keys across tool inputs and API responses.
export const ObjectRecordSchema = z.record(z.string(), z.any());
