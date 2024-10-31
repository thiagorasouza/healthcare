import { createDoctor } from "@/lib/actions/createDoctor";
import fs from "node:fs/promises";
import path from "node:path";

const doctors = [
  {
    name: "Michael Berzatto",
    email: "michael@email.com",
    phone: "+351900100204",
    specialty: "Neurologist",
    bio: "Michael Berzatto is a dedicated neurologist specializing in neurodegenerative disorders. With a background in neuroscience, he is committed to advancing treatments for neurological diseases and providing patient-centered care.",
    picturePath: "/doctors/mdoctor1.png",
  },
  {
    name: "Natalie Berzatto",
    email: "natalie@email.com",
    phone: "+351900100205",
    specialty: "Pediatrician",
    bio: "Natalie Berzatto is a compassionate pediatrician focused on child health and development. With over a decade of experience, she emphasizes preventive medicine and early childhood care.",
    picturePath: "/doctors/fdoctor1.png",
  },
  {
    name: "Ebraheim Mian",
    email: "ebraheim@email.com",
    phone: "+351900100206",
    specialty: "Psychiatrist",
    bio: "Ebraheim Mian is an experienced psychiatrist specializing in adult and adolescent mental health. He combines a modern clinical approach with empathy to provide evidence-based treatments.",
    picturePath: "/doctors/mdoctor2.png",
  },
  {
    name: "Marcus Brooks",
    email: "marcus@email.com",
    phone: "+351900100207",
    specialty: "Gynecologist",
    bio: "Marcus Brooks is a dedicated gynecologist focused on women’s health and reproductive medicine. Known for his compassionate approach, Marcus creates a welcoming environment for his patients.",
    picturePath: "/doctors/fdoctor2.png",
  },
  {
    name: "Tina Marrero",
    email: "tina@email.com",
    phone: "+351900100208",
    specialty: "Oncologist",
    bio: "Tina Marrero is an oncologist with extensive experience in personalized cancer treatments. Known for her dedication, Tina prioritizes empathy and support alongside advanced therapies.",
    picturePath: "/doctors/mdoctor1.png",
  },
  {
    name: "Gary Holmes",
    email: "gary@email.com",
    phone: "+351900100209",
    specialty: "Ophthalmologist",
    bio: "Gary Holmes is an ophthalmologist focused on ocular health and vision preservation. Trained in advanced eye care techniques, he prioritizes patient-centered care.",
    picturePath: "/doctors/fdoctor1.png",
  },
  {
    name: "Neil Fak",
    email: "neil@email.com",
    phone: "+351900100210",
    specialty: "Orthopedic Surgeon",
    bio: "Neil Fak is an orthopedic surgeon specializing in sports injuries and joint replacements. Known for his precision and innovative techniques, Neil has helped numerous patients regain mobility.",
    picturePath: "/doctors/mdoctor2.png",
  },
  {
    name: "Josh Lang",
    email: "josh@email.com",
    phone: "+351900100211",
    specialty: "Endocrinologist",
    bio: "Josh Lang is an endocrinologist focused on hormone disorders and metabolic diseases. With a personalized approach, he combines patient education with effective treatments for long-term results.",
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
