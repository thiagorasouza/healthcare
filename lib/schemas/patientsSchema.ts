import { z } from "zod";

export const allowedFileTypes = ["application/pdf"];
export const allowedFileTypesTextual = ["PDF"];
export const maxFileSize = 5 * 1024 * 1024;

export const patientsSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((val) => /^\+[0-9]{5,15}$/.test(val)),
  birthdate: z.coerce.date(), // YYYY-MM-DD
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(2).max(200),
  insuranceProvider: z.string().min(2).max(100),
  insuranceNumber: z.string().min(2).max(100),
  identificationType: z.enum(["passport", "identityCard", "driversLicense", "other"]),
  identificationNumber: z.string().min(2).max(100),
  identification: z.instanceof(File).refine((file) => {
    return (
      file.name !== "" && file.size <= maxFileSize && allowedFileTypes.includes(file.type.trim())
    );
  }),
  usageConsent: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to continue" }),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to continue" }),
});

export const patientDefaultValues = {
  name: "",
  email: "",
  phone: "",
  birthdate: undefined,
  gender: undefined,
  address: "",
  insuranceProvider: "",
  insuranceNumber: "",
  identificationType: undefined,
  identificationNumber: "",
  identification: undefined,
  usageConsent: undefined,
  privacyConsent: undefined,
};

export type PatientData = z.infer<typeof patientsSchema>;
