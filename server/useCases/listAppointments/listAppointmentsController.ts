import { ListAppointmentsUseCase } from "@/server/useCases/listAppointments/listAppointmentsUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class ListAppointmentsController extends GenericController<void, ListAppointmentsUseCase> {}
