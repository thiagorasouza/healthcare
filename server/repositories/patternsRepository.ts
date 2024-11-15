import { PatternModel } from "@/server/domain/models/patternModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { PatternNotFoundFailure } from "@/server/shared/failures";
import { PatternsFoundSuccess } from "@/server/shared/successes";

export interface PatternsRepositoryInterface extends RepositoryInterface<PatternModel> {
  getByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
}
