"use server";

import { databases, ID, storage, users } from "@/lib/appwrite/adminClient";
import { invalidFieldsError, success, unexpectedError } from "@/lib/results";
import { userNotFoundError } from "@/lib/results/errors/userNotFoundError";
import { doctorsSchema, getRawDoctorData } from "@/lib/schemas/doctorsSchema";
import { isAppwriteException } from "@/lib/utils";

export async function updateDoctor(formData: FormData) {
  try {
    const rawData = getRawDoctorData(formData);
    console.log("🚀 ~ rawData:", rawData);

    const doctorId = rawData.doctorId;
    const authId = rawData.authId;
    if (
      !doctorId ||
      typeof doctorId !== "string" ||
      !authId ||
      typeof authId !== "string"
    ) {
      return invalidFieldsError();
    }

    const validation = doctorsSchema.safeParse(rawData);
    if (!validation.success) {
      return invalidFieldsError();
    }

    const { name, email, phone, specialty, bio, picture } = validation.data;

    const user = await users.get(authId);

    if (name !== user.name) {
      const nameUpdated = await users.updateName(authId, name);
      console.log("🚀 ~ nameUpdated:", nameUpdated);
    }
    if (email !== user.email) {
      const emailUpdated = await users.updateEmail(authId, email);
      console.log("🚀 ~ emailUpdated:", emailUpdated);
    }
    if (phone !== user.phone) {
      const phoneUpdated = await users.updatePhone(authId, phone);
      console.log("🚀 ~ phoneUpdated:", phoneUpdated);
    }

    let fileUploaded;
    if (picture.name !== "___current___.jpg") {
      fileUploaded = await storage.createFile(
        process.env.IMAGES_BUCKET_ID!,
        ID.unique(),
        picture,
      );
      console.log("🚀 ~ fileUploaded:", fileUploaded);
    }

    const doctorUpdated = await databases.updateDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
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
