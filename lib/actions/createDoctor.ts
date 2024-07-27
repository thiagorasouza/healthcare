"use server";

import {
  databases,
  ID,
  Permission,
  Role,
  storage,
  users,
} from "@/lib/appwrite/adminClient";
import { invalidFieldsError, success, unexpectedError } from "@/lib/results";
import { userAlreadyRegisteredError } from "@/lib/results/errors/userAlreadyRegisteredError";
import { doctorsSchema, getRawDoctorData } from "@/lib/schemas/doctorsSchema";
import {
  generateRandomPassword,
  getInvalidFieldsList,
  isAppwriteException,
} from "@/lib/utils";

export async function createDoctor(formData: FormData) {
  try {
    const rawData = getRawDoctorData(formData);

    const validation = doctorsSchema.safeParse(rawData);
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
    console.log("🚀 ~ userCreated:", userCreated);

    const authId = userCreated.$id;

    const fileUploaded = await storage.createFile(
      process.env.IMAGES_BUCKET_ID!,
      ID.unique(),
      validData.picture,
    );
    console.log("🚀 ~ fileUploaded:", fileUploaded);
    const pictureId = fileUploaded.$id;

    const labelUpdated = await users.updateLabels(authId, ["doctor"]);
    console.log("🚀 ~ labelUpdated:", labelUpdated);

    const doctorCreated = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
      ID.unique(),
      {
        name: validData.name,
        specialty: validData.specialty,
        bio: validData.bio,
        authId,
        pictureId,
      },
      [
        Permission.read(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.update(Role.user(authId)),
        Permission.delete(Role.user(authId)),
      ],
    );
    console.log("🚀 ~ doctorCreated:", doctorCreated);

    const result = { user: labelUpdated, doctor: doctorCreated };
    console.log("🚀 ~ result:", result);

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
