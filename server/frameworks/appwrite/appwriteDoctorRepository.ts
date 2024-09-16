import { isAppwriteException } from "@/lib/utils";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { DoctorsRepository } from "@/server/repositories/doctorsRepository";
import { DoctorNotFoundFailure } from "@/server/shared/failures";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { DoctorFoundSuccess } from "@/server/shared/successes";
import { Databases } from "node-appwrite";

export class AppwriteDoctorRepository extends AppwriteRepository implements DoctorsRepository {
  constructor(databases: Databases, databaseId: string, collectionId: string) {
    super(databases, databaseId, collectionId);
  }

  public async getDoctorById(
    doctorId: string,
  ): Promise<DoctorFoundSuccess | DoctorNotFoundFailure> {
    try {
      const result = (await this.getDocument(doctorId)) as Appwritify<DoctorModel>;

      return new DoctorFoundSuccess(this.map(result));
    } catch (error) {
      if (isAppwriteException(error) && error.type === "document_not_found") {
        return new DoctorNotFoundFailure(doctorId);
      } else {
        return new ServerFailure(error);
      }
    }
  }

  private map(data: Appwritify<DoctorModel>): DoctorModel {
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
