import { PatternModel } from "@/server/domain/models/patternModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { PatternNotFoundFailure } from "@/server/useCases/shared/failures";
import { PatternsFoundSuccess } from "@/server/useCases/shared/successes";

export interface PatternsRepositoryInterface extends RepositoryInterface<PatternModel> {
  getByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
}
