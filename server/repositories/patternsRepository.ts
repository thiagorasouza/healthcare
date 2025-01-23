import { PatternModel } from "@/server/domain/models/patternModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { Success } from "@/server/useCases/shared/core/success";
import { ServerFailure } from "@/server/useCases/shared/failures";

export interface PatternsRepositoryInterface extends RepositoryInterface<PatternModel> {
  listByDoctorId(doctorId: string): Promise<Success<PatternModel[]> | ServerFailure>;
}
