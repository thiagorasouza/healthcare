import { env } from "@/server/config/env";
import { PatientModel } from "@/server/domain/models/patientModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { databases } from "@/server/frameworks/appwrite/appwriteNodeClient";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { PatientsRepository } from "@/server/repositories/patientsRepository";

export class AppwritePatientsRepository
  extends AppwriteRepository<PatientModel>
  implements PatientsRepository
{
  constructor() {
    super(databases, env.databaseId, env.patientsCollectionId);
  }

  async getPatientById(patientId: string) {
    return await this.getDocumentById(patientId);
  }

  public map(data: Appwritify<PatientModel>): PatientModel {
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
