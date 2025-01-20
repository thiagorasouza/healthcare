import { DoctorFormData, UpdateDoctorData } from "@/server/adapters/zod/doctorValidator";
import { currentPictureName } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { DoctorsRepositoryInterface, StorageRepositoryInterface } from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export type UpdateDoctorRequest = UpdateDoctorData;

export class UpdateDoctorUseCase implements UseCase {
  public constructor(
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly storageRepository: StorageRepositoryInterface,
  ) {}

  public async execute(
    request: UpdateDoctorRequest,
  ): Promise<Success<DoctorModel> | NotFoundFailure | ServerFailure> {
    try {
      // console.log("🚀 ~ request:", request);
      const { id, name, email, phone, bio, specialty, picture } = request;

      const doctorResult = await this.doctorsRepository.getById(id);
      if (!doctorResult.ok) {
        return doctorResult;
      }

      let pictureId;
      if (picture.name !== currentPictureName) {
        const fileResult = await this.storageRepository.createImage(picture);
        if (!fileResult.ok) {
          return fileResult;
        }
        pictureId = fileResult.value.id;
      }

      const updateResult = await this.doctorsRepository.update(id, {
        name,
        email,
        phone,
        bio,
        specialty,
        ...(pictureId ? { pictureId } : {}),
      });

      return updateResult;
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
