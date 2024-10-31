import { env } from "@/server/config/env";
import { PatientModel } from "@/server/domain/models/patientModel";
import { Appwritify } from "@/server/frameworks/appwrite/helpers";
import { Repository } from "@/server/frameworks/appwrite/repository";
import { PatientsRepositoryInterface } from "@/server/repositories/patientsRepository";

export class PatientsRepository
  extends Repository<PatientModel>
  implements PatientsRepositoryInterface
{
  constructor() {
    super(env.patientsCollectionId);
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
