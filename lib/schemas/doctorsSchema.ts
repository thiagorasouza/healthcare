import { z } from "zod";
import { AppwriteDocumentProperties } from "./appwriteSchema";

export const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];
export const maxImageSize = 5 * 1024 * 1024;

export const doctorsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((val) => /^\+[0-9]{5,15}$/.test(val)),
  specialty: z.string().min(2).max(100),
  bio: z.string().min(2).max(500),
  picture: z
    .instanceof(File)
    .refine(
      (file) =>
        file.name !== "" &&
        file.size <= maxImageSize &&
        allowedImageTypes.includes(file.type),
    ),
});

export type DoctorData = z.infer<typeof doctorsSchema>;

export type AppwriteDoctorData = DoctorData &
  AppwriteDocumentProperties & { authId: string };

export function getRawDoctorData(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    specialty: formData.get("specialty"),
    bio: formData.get("bio"),
    picture: formData.get("picture"),
  };
}
