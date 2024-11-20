import { Success } from "@/server/core/success";
import { EmailsRepositoryInterface } from "@/server/repositories/emailsRepository";
import { ServerFailure } from "@/server/shared/failures";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export class EmailsRepository implements EmailsRepositoryInterface {
  public constructor() {}

  public async send(
    to: string,
    subject: string,
    body: string,
  ): Promise<Success<string> | ServerFailure> {
    try {
      await resend.emails.send({
        from: "mednow@thiago-souza.com",
        to,
        subject,
        html: body,
      });

      return new Success(`Email sent to ${to}`);
    } catch (error) {
      console.log(error);
      return new ServerFailure(error);
    }
  }
}