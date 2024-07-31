import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";
import { RefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { faker } from "@faker-js/faker";
import { getRandomDoctorSpecialty } from "@/lib/utils";

const TestDoctorFillWithRandomData = ({
  form,
}: {
  form: UseFormReturn<any>;
  formRef: RefObject<HTMLFormElement>;
}) => {
  async function fillWithRandomData() {
    form.setValue("name", faker.person.firstName() + " " + faker.person.lastName(), {
      shouldValidate: true,
    });
    const picture = await fetch(faker.image.avatarGitHub()).then((response) => response.blob());
    form.setValue("picture", new File([picture], "randomPicture.png", { type: "image/png " }), {
      shouldValidate: true,
    });
    form.setValue("specialty", getRandomDoctorSpecialty(), { shouldValidate: true });
    form.setValue("bio", faker.lorem.paragraph(2), { shouldValidate: true });
    form.setValue("email", faker.internet.email(), { shouldValidate: true });
    form.setValue("phone", faker.helpers.fromRegExp("+3519[0-9]{8}"), { shouldValidate: true });
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
      <Button type="button" className="w-full" variant="outline" onClick={fillWithRandomData}>
        <FlaskConicalIcon className="mr-2 h-4 w-4" /> Fill With Random Data
      </Button>
    </div>
  );
};

export default TestDoctorFillWithRandomData;
