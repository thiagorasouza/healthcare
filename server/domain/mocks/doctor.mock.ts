import { faker } from "@faker-js/faker";

export const mockDoctor = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  specialty: faker.person.jobType(),
  bio: faker.lorem.paragraph(),
  pictureId: faker.string.uuid(),
  authId: faker.string.uuid(),
});
