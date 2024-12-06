import { LoginRequest, type LoginUseCase } from "@/server/useCases/login/loginUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class LoginController extends GenericController<LoginRequest, LoginUseCase> {}
