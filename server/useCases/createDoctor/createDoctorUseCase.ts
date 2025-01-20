import { DoctorData } from "@/server/domain/models/doctorData";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { DoctorsRepositoryInterface, StorageRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { ServerFailure } from "@/server/useCases/shared/failures";

export class CreateDoctorUseCase implements UseCase {
  constructor(
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly storageRepository: StorageRepositoryInterface,
  ) {}

  async execute(request: DoctorData): Promise<Success<DoctorModel> | ServerFailure> {
    const fileUploadResult = await this.storageRepository.createImage(request.picture);
    if (!fileUploadResult.ok) {
      return fileUploadResult;
    }

    const pictureId = fileUploadResult.value.id;
    const doctorData = { ...request };
    Reflect.deleteProperty(doctorData, "picture");

    const createDoctorResult = await this.doctorsRepository.create({
      ...doctorData,
      pictureId,
    });
    if (!createDoctorResult.ok) {
      return createDoctorResult;
    }

    return new Success(createDoctorResult.value);
  }
}
