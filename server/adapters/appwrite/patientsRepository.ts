import { env } from "@/server/config/env";
import { Success } from "@/server/useCases/shared/core/success";
import { PatientModel } from "@/server/domain/models/patientModel";
import { Appwritify } from "@/server/adapters/appwrite/helpers";
import { Repository } from "@/server/adapters/appwrite/repository";
import { PatientsRepositoryInterface } from "@/server/repositories";

export class PatientsRepository
  extends Repository<PatientModel>
  implements PatientsRepositoryInterface
{
  constructor() {
    super(env.patientsCollectionId);
  }

  public async getByEmail(email: string) {
    const result = await this.listByField("email", [email]);
    return result.ok ? new Success(result.value[0]) : result;
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
    };
  }
}
