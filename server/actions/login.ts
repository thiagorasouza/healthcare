"use server";

import { UsersRepository } from "@/server/adapters/appwrite/usersRepository";
import { CookiesRepository } from "@/server/adapters/next/cookiesRepository";
import { loginValidator } from "@/server/adapters/zod/loginValidator";
import { LoginController } from "@/server/useCases/login/loginController";
import { LoginUseCase } from "@/server/useCases/login/loginUseCase";

export const login = async (formData: FormData) => {
  const usersRepository = new UsersRepository();
  const cookiesRepository = new CookiesRepository();

  const useCase = new LoginUseCase(usersRepository, cookiesRepository);
  const controller = new LoginController(useCase, loginValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
