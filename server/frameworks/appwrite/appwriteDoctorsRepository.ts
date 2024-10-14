import { env } from "@/server/config/env";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { databases } from "@/server/frameworks/appwrite/appwriteNodeClient";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { DoctorsRepository } from "@/server/repositories/doctorsRepository";

export class AppwriteDoctorsRepository
  extends AppwriteRepository<DoctorModel>
  implements DoctorsRepository
{
  constructor() {
    super(databases, env.databaseId, env.doctorsCollectionId);
  }

  public async getDoctorById(doctorId: string) {
    return await this.getDocumentById(doctorId);
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
