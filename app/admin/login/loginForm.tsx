import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { loginAdmin } from "./loginAdmin";
import { LoginData } from "./loginData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./loginSchema";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

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

  return (
    <Form {...form}>
      {message && (
        <Alert variant="destructive" className="text-sm">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-cy="email"
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
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
