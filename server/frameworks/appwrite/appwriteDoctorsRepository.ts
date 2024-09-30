import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { DoctorsRepository } from "@/server/repositories/doctorsRepository";
import { Databases } from "node-appwrite";

export class AppwriteDoctorsRepository
  extends AppwriteRepository<DoctorModel>
  implements DoctorsRepository
{
  constructor(databases: Databases, databaseId: string, collectionId: string) {
    super(databases, databaseId, collectionId);
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
