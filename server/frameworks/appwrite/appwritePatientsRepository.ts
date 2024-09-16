import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { PatientsRepository } from "@/server/repositories/patientsRepository";
import { PatientNotFoundFailure } from "@/server/shared/failures";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { PatientFoundSuccess } from "@/server/shared/successes";
import { Databases } from "node-appwrite";

export class AppwritePatientsRepository extends AppwriteRepository implements PatientsRepository {
  constructor(databases: Databases, databaseId: string, collectionId: string) {
    super(databases, databaseId, collectionId);
  }

  async getPatientById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure> {
    try {
      const result = (await this.getDocument(patientId)) as Appwritify<PatientModel>;
      if (!result) {
        return new PatientNotFoundFailure(patientId);
      }

      return new PatientFoundSuccess(this.map(result));
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  // public async getPatientById(
  //   patientId: string,
  // ): Promise<DoctorFoundSuccess | DoctorNotFoundFailure> {
  //   try {
  //     const result = (await this.getDocument(doctorId)) as Appwritify<DoctorModel>;
  //     if (!result) {
  //       return new DoctorNotFoundFailure(doctorId);
  //     }

  //     return new DoctorFoundSuccess(this.map(result));
  //   } catch (error) {
  //     return new ServerFailure(error);
  //   }
  // }

  private map(data: Appwritify<PatientModel>): PatientModel {
    return {
      id: data.$id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthdate: new Date(data.birthdate),
      gender: data.gender,
      address: data.address,
      insuranceProvider: data.insuranceProvider,
      insuranceNumber: data.insuranceNumber,
      identificationType: data.identificationType,
      identificationNumber: data.identificationNumber,
      identificationId: data.identificationId,
      usageConsent: data.usageConsent,
      privacyConsent: data.privacyConsent,
      authId: data.authId,
    };
  }
}
