import { Success } from "@/server/useCases/shared/core/success";
import { PatientData } from "@/server/domain/models/patientData";
import { PatientModel } from "@/server/domain/models/patientModel";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { PatientsRepositoryInterface, StorageRepositoryInterface } from "@/server/repositories";

// algorithm
// 1. validate patient data - done in the controller
// 2. upload patient document
// 3. create patient

export class CreatePatientUseCase implements UseCase {
  constructor(
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly storageRepository: StorageRepositoryInterface,
  ) {}

  async execute(request: PatientData): Promise<Success<PatientModel> | ServerFailure> {
    const fileUploadResult = await this.storageRepository.create(request.identification);
    if (!fileUploadResult.ok) {
      return fileUploadResult;
    }

    const identificationId = fileUploadResult.value.id;
    const patientData = { ...request };
    Reflect.deleteProperty(patientData, "identification");

    const createPatientResult = await this.patientsRepository.create({
      ...patientData,
      identificationId,
    });
    if (!createPatientResult.ok) {
      return createPatientResult;
    }

    return new Success(createPatientResult.value);
  }
}
