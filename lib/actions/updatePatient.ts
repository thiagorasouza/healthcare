"use server";

import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { databases, ID, storage, users } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { userNotFoundError } from "@/lib/results/errors/userNotFoundError";
import {
  parsePatientData,
  PatientParsedData,
  PatientStoredData,
  patientsZodSchema,
} from "@/lib/schemas/patientsSchema";
import { getInvalidFieldsList, isAppwriteException } from "@/lib/utils";

export type UpdatePatientResult = Success<PatientParsedData> | Error<string[] | undefined>;

export async function updatePatient(formData: FormData): Promise<UpdatePatientResult> {
  try {
    const rawData = Object.fromEntries(formData);
    // console.log("🚀 ~ rawData:", rawData);

    const patientId = rawData.patientId;
    const authId = rawData.authId;
    if (!patientId || typeof patientId !== "string" || !authId || typeof authId !== "string") {
      return unexpectedError();
    }

    const validation = patientsZodSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const validData = validation.data;
    const { name, email, phone, identification } = validData;

    const user = await users.get(authId);

    if (name !== user.name) {
      await users.updateName(authId, name);
    }
    if (email !== user.email) {
      await users.updateEmail(authId, email);
    }
    if (phone !== user.phone) {
      await users.updatePhone(authId, phone);
    }

    let fileUploaded;
    if (identification.size > 0) {
      fileUploaded = await storage.createFile(env.docsBucketId, ID.unique(), identification);
    }

    Reflect.deleteProperty(validData, "identification");

    const patientUpdated = (await databases.updateDocument(
      env.databaseId,
      env.patientsCollectionId,
      patientId,
      {
        ...validData,
        ...(fileUploaded ? { identificationId: fileUploaded.$id } : {}),
        authId,
      },
    )) as PatientStoredData;

    return success(parsePatientData(patientUpdated));
  } catch (error) {
    console.log(error);
    if (isAppwriteException(error) && error.type === "user_not_found") {
      return userNotFoundError();
    }

    return unexpectedError();
  }
}
