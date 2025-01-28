import { PatternFormData } from "@/server/adapters/zod/patternValidator";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { Pattern } from "@/server/domain/pattern";
import { PatternsRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { ConflictingPatternsFailure } from "@/server/useCases/shared/failures/ConflictingPatternsFailure";

export type CreatePatternRequest = PatternFormData;

export class CreatePatternUseCase implements UseCase {
  public constructor(private readonly patternsRepository: PatternsRepositoryInterface) {}

  public async execute(
    request: CreatePatternRequest,
  ): Promise<Success<PatternModel> | ConflictingPatternsFailure | ServerFailure> {
    try {
      const doctorResult = await this.patternsRepository.listByDoctorId(request.doctorId);
      if (!doctorResult.ok) {
        return doctorResult;
      }

      const pattern = new Pattern(request);
      const storedPatterns = doctorResult.value;

      for (const storedPattern of storedPatterns) {
        if (pattern.isConflicting(storedPattern)) {
          return new ConflictingPatternsFailure();
        }
      }

      const { weekdays, ...rest } = request;
      const createResult = await this.patternsRepository.create({
        weekdays: weekdays as Weekday[],
        ...rest,
      });

      return createResult;
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
