import { PatientsIndexedByName } from "@/server/domain/models/patientIndexedByName";
import { PatientsRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { ServerFailure } from "@/server/useCases/shared/failures";

export class ListPatientsForSearchUseCase implements UseCase {
  public constructor(private readonly patientsRepository: PatientsRepositoryInterface) {}

  public async execute(): Promise<Success<PatientsIndexedByName> | ServerFailure> {
    try {
      const patientsResult = await this.patientsRepository.list();
      if (!patientsResult.ok) {
        return patientsResult;
      }
      const patients = patientsResult.value;

      if (patients.length === 0) {
        return new Success({});
      }

      const patientsIndexedByName = patients.reduce((obj, patient) => {
        obj[patient.name] = {
          id: patient.id,
          name: patient.name,
          phone: patient.phone,
        };
        return obj;
      }, {} as PatientsIndexedByName);

      return new Success(patientsIndexedByName);
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
