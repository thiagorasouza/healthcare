import { createDoctor } from "@/lib/actions/createDoctor";
import fs from "node:fs/promises";
import path from "node:path";

const doctors = [
  {
    name: "Dr. Claire Dunlap",
    email: "claire@email.com",
    phone: "+351900100200",
    specialty: "Cardiologist",
    bio: "Dr. Claire, a seasoned cardiologist in Lisbon, brings years of expertise in hospital settings. She holds a medical degree from the University of Lisbon and a cardiology specialization from the University of Porto. Dr. Claire is dedicated to heart health and patient care.",
    picturePath: "/doctors/fdoctor1.png",
  },
  {
    name: "Dr. Carmen Berzatto",
    email: "carmen@email.com",
    phone: "+351900100201",
    specialty: "Surgeon",
    bio: "Dr. Carmen Berzatto is a skilled surgeon with over 15 years of experience in complex surgical procedures. She is known for her precision and dedication to patient safety, having trained at some of the top medical institutions in Europe.",
    picturePath: "/doctors/mdoctor1.png",
  },
  {
    name: "Dr. Richard Jerimovich",
    email: "richard@email.com",
    phone: "+351900100202",
    specialty: "Dermatologist",
    bio: "Dr. Richard Jerimovich is a renowned dermatologist specializing in skin disorders, cosmetic treatments, and laser therapy. He holds a medical degree from the University of Coimbra and has published numerous articles on skincare.",
    picturePath: "/doctors/mdoctor2.png",
  },
  {
    name: "Dr. Sydney Adamu",
    email: "sydney@email.com",
    phone: "+351900100203",
    specialty: "General Practitioner",
    bio: "Dr. Sydney Adamu is a compassionate General Practitioner who focuses on preventive care and holistic patient treatment. With a diverse background in community health, she strives to provide comprehensive and empathetic care to her patients.",
    picturePath: "/doctors/fdoctor2.png",
  },
];

async function createFileObj(webPath: string) {
  const fullPath = path.join(__dirname, "../../public", webPath);
  const buffer = await fs.readFile(fullPath);
  const filename = webPath.split("/").pop();
  const file = new File([buffer], filename!, {
    type: "image/png",
  });
  return file;
}

async function createDoctorFormData(data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("specialty", data.specialty);
  formData.append("bio", data.bio);
  const picture = await createFileObj(data.picturePath);
  formData.append("picture", picture);
  return formData;
}

async function createMockDoctors() {
  for (const doctor of doctors) {
    const formData = await createDoctorFormData(doctor);
    await createDoctor(formData);
  }
}

createMockDoctors();
