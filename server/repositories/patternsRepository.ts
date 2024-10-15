import { PatternNotFoundFailure } from "@/server/shared/failures";
import { PatternsFoundSuccess } from "@/server/shared/successes";

export interface PatternsRepositoryInterface {
  getPatternsByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
}
