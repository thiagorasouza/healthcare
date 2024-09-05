import DoctorChooseCard from "@/components/doctors/DoctorChooseCard";

const doctors = [
  {
    name: "Dr. Claire",
    specialty: "Cardiologist",
    bgColor: "bg-light-purple", // light purple
    picture: "/doctors/fdoctor1.png",
  },
  {
    name: "Dr. Carmen",
    specialty: "Surgeon",
    bgColor: "bg-light-yellow", // light yellow
    picture: "/doctors/mdoctor1.png",
  },
  {
    name: "Dr. Richard",
    specialty: "Dermatologist",
    bgColor: "bg-light-green", // light green
    picture: "/doctors/mdoctor2.png",
  },
  {
    name: "Dr. Sydney",
    specialty: "General",
    bgColor: "bg-light-blue", // light blue
    picture: "/doctors/fdoctor2.png",
  },
];

export default function CreateAppointmentPage() {
  return (
    <div className="container mx-auto w-fit max-w-[1200px] space-y-20 px-6 py-10">
      <section className="text-center">
        <h1 className="mb-2 text-2xl font-bold">
          Let&apos;s find your <span className="text-highlight">top doctor</span>
        </h1>
        <p className="text-gray font-medium">Choose a doctor to see his or her available hours</p>
      </section>
      <section>
        <ul className="flex justify-between gap-6">
          {doctors.map((doctor, index) => (
            <li key={index}>
              <DoctorChooseCard doctor={doctor} />
            </li>
          ))}
        </ul>
      </section>
      <div className="flex gap-[72px]">
        <div className="flex flex-col gap-[30px]">
          <section>
            <h2 className="text-lg font-semibold">Information</h2>
            <p className="text-gray">
              Dr. Claire, a seasoned cardiologist in Lisbon, brings years of expertise in hospital
              settings. She holds a medical degree from the University of Lisbon and a cardiology
              specialization from the University of Porto. Dr. Claire is dedicated to heart health
              and patient care.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
