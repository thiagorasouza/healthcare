import { Models } from "node-appwrite";
import { z } from "zod";

export const allowedImageTypes = ["image/png", "image/jpeg", "image/gif"];
export const maxImageSize = 5 * 1024 * 1024;

export const doctorsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((val) => /^\+[0-9]{5,15}$/.test(val)),
  specialty: z.string().min(2).max(100),
  bio: z.string().min(2).max(500),
  picture: z.instanceof(File).refine((file) => {
    return (
      file.name !== "" && file.size <= maxImageSize && allowedImageTypes.includes(file.type.trim())
    );
  }),
});

export type DoctorData = z.infer<typeof doctorsSchema>;

export type DoctorDataUpdate = Omit<DoctorData, "picture"> & {
  pictureId: string;
  doctorId: string;
  authId: string;
};

export type Doctor = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  pictureId: string;
  authId: string;
} & Models.Document;

/**
 * 
 * async function createDoctorCollection() {
  const colId = env.doctorsCollectionId;

  try {
    await databases.deleteCollection(dbId, colId);
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
    console.log(error);
  }
}
 */

export function getRawDoctorData(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    specialty: formData.get("specialty"),
    bio: formData.get("bio"),
    picture: formData.get("picture"),
    doctorId: formData.get("doctorId"),
    authId: formData.get("authId"),
  };
}
