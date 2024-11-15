import { Success } from "@/server/core/success";
import { PatientData } from "@/server/domain/models/patientData";
import { PatientModel } from "@/server/domain/models/patientModel";
import { PatientsRepositoryInterface } from "@/server/repositories";
import { ServerFailure } from "@/server/shared/failures";
import { UseCase } from "@/server/shared/protocols/useCase";
import { StorageRepositoryInterface } from "@/server/repositories/storageRepository";

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
