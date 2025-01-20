import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { allowedImageTypes, maxImageSize } from "@/server/config/constants";
import { z } from "zod";

export const doctorsFormSchema = z.object({
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

export type DoctorFormData = z.infer<typeof doctorsFormSchema>;

export const doctorValidator = new GenericValidator<DoctorFormData>(doctorsFormSchema);
