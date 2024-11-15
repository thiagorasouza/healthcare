import { databases, ID } from "@/lib/appwrite/adminClient";
import { genderTypes, idTypes } from "@/lib/constants";
import { env } from "@/lib/env";

const dbId = env.databaseId;

async function createDoctorCollection() {
  // const colId = env.doctorsCollectionId;
  const colId = ID.unique();

  try {
    // await databases.deleteCollection(dbId, colId);
    await databases.createCollection(dbId, colId, "doctors", undefined, true);
    await databases.createStringAttribute(dbId, colId, "name", 100, true);
    await databases.createEmailAttribute(dbId, colId, "email", true);
    await databases.createStringAttribute(dbId, colId, "phone", 100, true);
    await databases.createStringAttribute(dbId, colId, "specialty", 100, true);
    await databases.createStringAttribute(dbId, colId, "bio", 500, true);
    await databases.createStringAttribute(dbId, colId, "pictureId", 100, true);
    await databases.createStringAttribute(dbId, colId, "authId", 100, true);

    console.log("Doctors collection created");
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

async function createPatientCollection() {
  const idTypesArr = idTypes.map((idType) => idType.value);
  const genderTypesArr = genderTypes.map((genderTypes) => genderTypes.value);
  // const colId = env.patientsCollectionId;
  const colId = ID.unique();

  try {
    // await databases.deleteCollection(dbId, colId);
    await databases.createCollection(dbId, colId, "patients", undefined, true);
    await databases.createStringAttribute(dbId, colId, "name", 100, true);
    await databases.createEmailAttribute(dbId, colId, "email", true);
    await databases.createStringAttribute(dbId, colId, "phone", 100, true);
    await databases.createDatetimeAttribute(dbId, colId, "birthdate", true);
    await databases.createEnumAttribute(dbId, colId, "gender", genderTypesArr, true);
    await databases.createStringAttribute(dbId, colId, "address", 200, true);
    await databases.createStringAttribute(dbId, colId, "insuranceProvider", 100, true);
    await databases.createStringAttribute(dbId, colId, "insuranceNumber", 100, true);
    await databases.createEnumAttribute(dbId, colId, "identificationType", idTypesArr, true);
    await databases.createStringAttribute(dbId, colId, "identificationNumber", 100, true);
    await databases.createStringAttribute(dbId, colId, "identificationId", 100, true);
    await databases.createBooleanAttribute(dbId, colId, "usageConsent", true);
    await databases.createBooleanAttribute(dbId, colId, "privacyConsent", true);

    console.log("Patients collection created");
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

async function createPatternsCollection() {
  // const colId = env.patternsCollectionId;
  const colId = ID.unique();

  try {
    // await databases.deleteCollection(dbId, colId);
    await databases.createCollection(dbId, colId, "patterns", undefined, true);
    await databases.createDatetimeAttribute(dbId, colId, "startDate", true);
    await databases.createDatetimeAttribute(dbId, colId, "endDate", true);
    await databases.createDatetimeAttribute(dbId, colId, "startTime", true);
    await databases.createDatetimeAttribute(dbId, colId, "endTime", true);
    await databases.createIntegerAttribute(dbId, colId, "duration", true);
    await databases.createBooleanAttribute(dbId, colId, "recurring", true);
    await databases.createStringAttribute(dbId, colId, "weekdays", 100, false, undefined, true);
    await databases.createStringAttribute(dbId, colId, "doctorId", 100, true);

    console.log("Patterns collection created");
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

async function createAppointmentsCollection() {
  // const colId = env.appointmentsCollectionId;
  const colId = ID.unique();

  try {
    // await databases.deleteCollection(dbId, colId);
    await databases.createCollection(dbId, colId, "appointments", undefined, true);
    await databases.createStringAttribute(dbId, colId, "doctorId", 100, true);
    await databases.createStringAttribute(dbId, colId, "patientId", 100, true);
    await databases.createDatetimeAttribute(dbId, colId, "startTime", true);
    await databases.createIntegerAttribute(dbId, colId, "duration", true);

    console.log("Appointments collection created");
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

createDoctorCollection();
createPatientCollection();
createPatternsCollection();
createAppointmentsCollection();
