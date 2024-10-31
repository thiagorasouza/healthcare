import { env } from "@/server/config/env";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Appwritify } from "@/server/frameworks/appwrite/helpers";
import { Repository } from "@/server/frameworks/appwrite/repository";
import { DoctorsRepositoryInterface } from "@/server/repositories/doctorsRepository";

export class DoctorsRepository
  extends Repository<DoctorModel>
  implements DoctorsRepositoryInterface
{
  constructor() {
    super(env.doctorsCollectionId);
  }

  public map(data: Appwritify<DoctorModel>): DoctorModel {
    return {
      id: data.$id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      bio: data.bio,
      authId: data.authId,
      pictureId: data.pictureId,
    };
  }
}
