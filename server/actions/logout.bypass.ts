"use server";

import { UsersRepository } from "@/server/adapters/appwrite/usersRepository";

export async function logout() {
  const repository = new UsersRepository();
  const result = await repository.logout();
  const plainObject = Object.assign({}, result);
  return plainObject;
}
