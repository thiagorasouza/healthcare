import { ListAppointmentsUseCase } from "@/server/useCases/listAppointments/listAppointmentsUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class ListAppointmentsController extends GenericActionController<
  void,
  ListAppointmentsUseCase
> {}
