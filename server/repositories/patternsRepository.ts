import { PatternNotFoundFailure } from "@/server/shared/failures";
import { PatternsFoundSuccess } from "@/server/shared/successes";

export interface PatternsRepository {
  getPatternsByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
}
