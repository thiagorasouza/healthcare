"use server";

import { databases, ID, storage, users } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { invalidFieldsError, success, unexpectedError } from "@/lib/results";
import { userNotFoundError } from "@/lib/results/errors/userNotFoundError";
import { doctorsSchema, getRawDoctorData } from "@/lib/schemas/doctorsSchema";
import { getInvalidFieldsList, isAppwriteException } from "@/lib/utils";

export async function updateDoctor(formData: FormData) {
  try {
    const rawData = getRawDoctorData(formData);

    const doctorId = rawData.doctorId;
    const authId = rawData.authId;
    if (!doctorId || typeof doctorId !== "string" || !authId || typeof authId !== "string") {
      return unexpectedError();
    }

    const validation = doctorsSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const { name, email, phone, specialty, bio, picture } = validation.data;

    const user = await users.get(authId);

    if (name !== user.name) {
      const nameUpdated = await users.updateName(authId, name);
    }
    if (email !== user.email) {
      const emailUpdated = await users.updateEmail(authId, email);
    }
    if (phone !== user.phone) {
      const phoneUpdated = await users.updatePhone(authId, phone);
    }

    let fileUploaded;
    if (picture.name !== "___current___.jpg") {
      fileUploaded = await storage.createFile(env.imagesBucketId, ID.unique(), picture);
    }

    const doctorUpdated = await databases.updateDocument(
      env.databaseId,
      env.doctorsCollectionId,
      doctorId,
      {
        name,
        specialty,
        bio,
        ...(fileUploaded ? { pictureId: fileUploaded.$id } : {}),
      },
    );

    return success(doctorUpdated);
  } catch (error) {
    console.log(error);
    if (isAppwriteException(error) && error.type === "user_not_found") {
      return userNotFoundError();
    }

    return unexpectedError();
  }
}
