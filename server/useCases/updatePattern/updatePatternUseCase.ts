import { Weekday } from "@/lib/schemas/patternsSchema";
import { UpdatePatternData } from "@/server/adapters/zod/patternValidator";
import { PatternModel } from "@/server/domain/models/patternModel";
import { Pattern } from "@/server/domain/pattern";
import { PatternsRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import {
  DoctorUnavailableFailure,
  NotFoundFailure,
  ServerFailure,
} from "@/server/useCases/shared/failures";
import { ConflictingPatternsFailure } from "@/server/useCases/shared/failures/ConflictingPatternsFailure";

export type UpdatePatternRequest = UpdatePatternData;

export class UpdatePatternUseCase implements UseCase {
  public constructor(private readonly patternsRepository: PatternsRepositoryInterface) {}

  public async execute(
    request: UpdatePatternRequest,
  ): Promise<Success<PatternModel> | NotFoundFailure | DoctorUnavailableFailure | ServerFailure> {
    try {
      const { id, weekdays, ...partialRequest } = request;

      const patternResult = await this.patternsRepository.getById(id);
      if (!patternResult.ok) {
        return patternResult;
      }

      const doctorResult = await this.patternsRepository.listByDoctorId(request.doctorId);
      if (!doctorResult.ok) {
        return doctorResult;
      }

      const pattern = new Pattern(request);
      const storedPatterns = doctorResult.value;

      for (const storedPattern of storedPatterns) {
        // does not check for conflicts with the current pattern that is being updated
        if (storedPattern.id === id) continue;

        if (pattern.isConflicting(storedPattern)) {
          return new ConflictingPatternsFailure();
        }
      }

      const updateResult = await this.patternsRepository.update(id, {
        ...partialRequest,
        weekdays: weekdays as Weekday[],
      });

      return updateResult;
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
