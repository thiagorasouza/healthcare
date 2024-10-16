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
  patientsZodSchema,
  PatientStoredData,
} from "@/lib/schemas/patientsSchema";
import { generateRandomPassword, getInvalidFieldsList, isAppwriteException } from "@/lib/utils";

export type CreatePatientResult = Success<PatientParsedData> | Error<string[] | undefined>;

export async function createPatient(formData: FormData): Promise<CreatePatientResult> {
  try {
    const rawData = Object.fromEntries(formData);
    // console.log("🚀 ~ rawData:", rawData);

    const validation = patientsZodSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
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
    await users.updateLabels(authId, ["patient"]);

    const fileUploaded = await storage.createFile(
      env.docsBucketId,
      ID.unique(),
      validData.identification,
    );
    const identificationId = fileUploaded.$id;

    Reflect.deleteProperty(validData, "identification");

    const patientCreated = (await databases.createDocument(
      env.databaseId,
      env.patientsCollectionId,
      ID.unique(),
      {
        ...validData,
        identificationId,
        authId,
      },
      [
        Permission.read(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.delete(Role.user(authId)),
      ],
    )) as PatientStoredData;

    return success(parsePatientData(patientCreated));
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
