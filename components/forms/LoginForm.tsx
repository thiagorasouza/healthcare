import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { unexpectedError } from "@/lib/results";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginData, loginSchema } from "@/lib/schemas/loginSchema";
import { loginAdmin } from "@/lib/actions/loginAdmin";

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(loginData: LoginData) {
    setMessage("");
    try {
      const result = await loginAdmin(loginData);
      if (result.success) {
        router.push("/admin");
        return;
      }

      setMessage(result.message);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setMessage(unexpectedError().message);
    }
  }

  function testLoginAsAdmin() {
    form.setValue("email", "mednowadmin@email.com");
    form.setValue("password", "mednowadmin1234");
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <Form {...form}>
        <Alert
          variant="destructive"
          className={cn("text-sm leading-none", { hidden: message === "" })}
        >
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
          ref={formRef}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    data-cy="email"
                    placeholder="name@example.com"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy="emailError" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    data-cy="password"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy="passwordError" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            data-cy="submit"
            className="mt-4 w-full"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Testing options
            </span>
          </div>
        </div>
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={testLoginAsAdmin}
        >
          <FlaskConicalIcon className="mr-2 h-4 w-4" /> Login as Admin
        </Button>
      </div>
    </>
  );
}
