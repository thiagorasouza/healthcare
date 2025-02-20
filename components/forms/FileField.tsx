import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn, semanticJoin } from "@/lib/utils";
import { allowedFileTypesTextual } from "@/server/config/constants";
import { CircleCheckBig, ImageUp } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";

interface FileFieldProps {
  name: string;
  placeholder: string;
  accept: string[];
  maxSize: number;
  image: boolean;
  form: UseFormReturn<any>;
  className?: string;
}

const FileField = ({
  form,
  name,
  accept,
  className,
  image,
  placeholder,
  maxSize,
}: FileFieldProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      form.setValue(name, acceptedFiles[0], { shouldValidate: true });
    },
    [form, name],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: accept.reduce((obj: any, type: string) => {
      obj[type] = [];
      return obj;
    }, {}),
    multiple: false,
    maxSize,
  });

  const file = form.getValues(name);

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <div
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-border bg-background text-foreground",
                image ? "h-32 w-32" : "h-32 w-full gap-2",
                form.formState.errors[name] && "border-red-400 text-red-400",
                file && "border-green-400 font-semibold",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps({})} />
              {file ? (
                <>
                  {image ? (
                    <Image
                      src={URL.createObjectURL(field.value)}
                      alt="selected picture"
                      className="h-full w-full object-cover"
                      width={128}
                      height={128}
                    />
                  ) : (
                    <>
                      <CircleCheckBig className="h-7 w-7 text-green-400" />
                      <span className="text-center text-sm">{file.name}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <ImageUp className="h-6 w-6" />
                  <span className="text-center text-xs">
                    {isDragActive ? "Drop here" : placeholder} <br />
                    {semanticJoin(allowedFileTypesTextual)} (max.{" "}
                    {Math.floor(maxSize / (1024 * 1024)) + " MB"})
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

export default FileField;
