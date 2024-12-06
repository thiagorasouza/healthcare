"use server";

export default async function UpdateAppointmentPage({
  params,
}: {
  params: { appointmentId: string };
}) {
  const { appointmentId } = params;

  return <div>{appointmentId}</div>;
}
