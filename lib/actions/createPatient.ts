"use server";

import { databases, ID, Permission, Role, storage, users } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import {
  Error,
  invalidFieldsError,
  Success,
  success,
  unexpectedError,
  userAlreadyRegisteredError,
} from "@/lib/results";
import { UserStoredData } from "@/lib/schemas/appwriteSchema";
import {
  parsePatientData,
  PatientParsedData,
  patientsSchema,
  PatientStoredData,
} from "@/lib/schemas/patientsSchema";
import { generateRandomPassword, getInvalidFieldsList, isAppwriteException } from "@/lib/utils";

export type CreatePatientSuccess = { user: UserStoredData; patient: PatientParsedData };
export type CreatePatientError = string[] | undefined;
export type CreatePatientResult = Success<CreatePatientSuccess> | Error<CreatePatientError>;

export async function createPatient(formData: FormData): Promise<CreatePatientResult> {
  try {
    const rawData = Object.fromEntries(formData);
    // console.log("🚀 ~ rawData:", rawData);

    const validation = patientsSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      // console.log("🚀 ~ fieldsList:", fieldsList);
      return invalidFieldsError(fieldsList);
    }

    const validData = validation.data;

    const randomPassword = generateRandomPassword(16);
    const userCreated = await users.create(
      ID.unique(),
      validData.email,
      validData.phone,
      randomPassword,
      validData.name,
    );

    const authId = userCreated.$id;
    const labelUpdated = await users.updateLabels(authId, ["patient"]);

    const fileUploaded = await storage.createFile(
      env.docsBucketId,
      ID.unique(),
      validData.identification,
    );
    const identificationId = fileUploaded.$id;
    // console.log("🚀 ~ userData:", userData);

    const patientCreated = (await databases.createDocument(
      env.databaseId,
      env.patientsCollectionId,
      ID.unique(),
      {
        name: validData.name,
        birthdate: validData.birthdate,
        gender: validData.gender,
        address: validData.address,
        insuranceProvider: validData.insuranceProvider,
        insuranceNumber: validData.insuranceNumber,
        identificationType: validData.identificationType,
        identificationNumber: validData.identificationNumber,
        usageConsent: validData.usageConsent,
        privacyConsent: validData.privacyConsent,
        authId,
        identificationId,
      },
      [
        Permission.read(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.delete(Role.user(authId)),
      ],
    )) as PatientStoredData;

    const result = {
      user: labelUpdated,
      patient: parsePatientData(patientCreated),
    };

    // console.log("🚀 ~ result:", result);
    return success(result);
  } catch (error) {
    console.log(error);

    if (isAppwriteException(error)) {
      if (error.type === "user_already_exists") {
        return userAlreadyRegisteredError();
      }
    }

    return unexpectedError();
  }
}
