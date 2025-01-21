import { UpdatePatientData } from "@/server/adapters/zod/patientValidator";
import { currentDocumentName } from "@/server/config/constants";
import { PatientModel } from "@/server/domain/models/patientModel";
import { PatientsRepositoryInterface, StorageRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export type UpdatePatientRequest = UpdatePatientData;

export class UpdatePatientUseCase implements UseCase {
  public constructor(
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly storageRepository: StorageRepositoryInterface,
  ) {}

  public async execute(
    request: UpdatePatientRequest,
  ): Promise<Success<PatientModel> | NotFoundFailure | ServerFailure> {
    try {
      const { id, identification, ...rest } = request;

      const patientResult = await this.patientsRepository.getById(id);
      if (!patientResult.ok) {
        return patientResult;
      }

      let identificationId;
      if (identification.size > 0) {
        const fileResult = await this.storageRepository.createDocument(identification);
        if (!fileResult.ok) {
          return fileResult;
        }
        identificationId = fileResult.value.id;
      }

      const updateResult = await this.patientsRepository.update(id, {
        ...rest,
        ...(identificationId ? { identificationId } : {}),
      });

      return updateResult;
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
