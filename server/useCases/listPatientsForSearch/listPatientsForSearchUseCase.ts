import { PatientNamePhone } from "@/server/domain/models/patientNamePhone";
import { PatientsRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { ServerFailure } from "@/server/useCases/shared/failures";

export class ListPatientsForSearchUseCase implements UseCase {
  public constructor(private readonly patientsRepository: PatientsRepositoryInterface) {}

  public async execute(): Promise<Success<PatientNamePhone[]> | ServerFailure> {
    try {
      const patientsResult = await this.patientsRepository.list();
      if (!patientsResult.ok) {
        return patientsResult;
      }
      const patients = patientsResult.value;

      if (patients.length === 0) {
        return new Success([]);
      }

      const patiensForSearch: PatientNamePhone[] = patients.map(({ id, name, phone }) => ({
        id,
        name,
        phone,
      }));

      return new Success(patiensForSearch);
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
