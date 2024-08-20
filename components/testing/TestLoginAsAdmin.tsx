import { Button } from "@/components/ui/button";
import { testAdminEmail, testAdminPassword } from "@/lib/constants";
import { FlaskConicalIcon } from "lucide-react";
import { RefObject } from "react";
import { UseFormReturn } from "react-hook-form";

const TestLoginAsAdmin = ({
  form,
  formRef,
}: {
  form: UseFormReturn<any>;
  formRef: RefObject<HTMLFormElement>;
}) => {
  function testLoginAsAdmin() {
    form.setValue("email", testAdminEmail);
    form.setValue("password", testAdminPassword);
    formRef.current?.requestSubmit();
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Testing options</span>
        </div>
      </div>
      <Button type="button" className="w-full" variant="outline" onClick={testLoginAsAdmin}>
        <FlaskConicalIcon className="mr-2 h-4 w-4" /> Login as Admin
      </Button>
    </div>
  );
};

export default TestLoginAsAdmin;
