import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { allowedImageTypes } from "@/lib/schemas/doctorsSchema";
import { cn } from "@/lib/utils";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";

const PictureField = ({ form }: { form: UseFormReturn<any> }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // console.log("🚀 ~ acceptedFiles:", acceptedFiles);
      form.setValue("picture", acceptedFiles[0], { shouldValidate: true });
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: allowedImageTypes.reduce((obj: any, type: string) => {
        obj[type] = [];
        return obj;
      }, {}),
      multiple: false,
    });

  return (
    <FormField
      name="picture"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div
              className={cn(
                "flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-border bg-background text-foreground",
                form.formState.errors.picture && "border-red-400 text-red-400",
                field.value && "border-none",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps({})} />
              {field.value ? (
                <Image
                  src={URL.createObjectURL(field.value)}
                  alt="selected picture"
                  className="h-full w-full object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <>
                  <ImageUp className="h-6 w-6" />
                  <span className="text-center text-xs">
                    {isDragActive ? "Drop here" : "Upload"}
                  </span>
                </>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PictureField;
