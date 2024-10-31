import { PatternNotFoundFailure } from "@/server/shared/failures";
import { PatternsFoundSuccess } from "@/server/shared/successes";

export interface PatternsRepositoryInterface {
  getByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
}
