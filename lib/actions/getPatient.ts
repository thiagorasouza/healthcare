"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { Error, Success, success, unexpectedError } from "@/lib/results";
import {
  parsePatientData,
  PatientParsedData,
  PatientStoredData,
} from "@/lib/schemas/patientsSchema";

type GetPatientResult = Success<PatientParsedData> | Error<undefined>;

export async function getPatient(patientId: string): Promise<GetPatientResult> {
  try {
    const patient = (await databases.getDocument(
      env.databaseId,
      env.patientsCollectionId,
      patientId,
    )) as PatientStoredData;

    return success(parsePatientData(patient));
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
