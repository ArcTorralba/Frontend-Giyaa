import { UserCircleIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  ButtonProps as RACButtonProps,
  FileTrigger,
  FileTriggerProps,
} from 'react-aria-components';
import {
  Control,
  FieldPath,
  FieldPathByValue,
  FieldValues,
  useController,
} from 'react-hook-form';
import { buttonVariants } from '../ui/button';
import TextField, { TextFieldProps } from './text-field';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { z } from 'zod';

export const fileFieldSchema = z
  .object({
    file: z.instanceof(File).nullish(),
    url: z
      .string()
      .url()
      .nullish()
      .transform((x) => x ?? undefined),
  })
  .array();
export type FileFieldShape = z.infer<typeof fileFieldSchema>;

export default function FilePickerFieldRoot<
  T extends FieldValues,
  TName extends FieldPathByValue<T, FileFieldShape>,
>(
  props: {
    control: Control<T>;
    children: (args: FileFieldShape) => React.ReactNode;
  } & Omit<TextFieldProps<T, TName>, 'control' | 'children' | 'field'> &
    Omit<FileTriggerProps, 'onSelect' | 'children'> & {
      control: Control<T>;
      field: TName;
    },
) {
  const {
    children,
    acceptedFileTypes,
    allowsMultiple,
    defaultCamera,
    ...textFieldProps
  } = props;
  // const [files, setFiles] = useState<FileFieldShape>([]);
  const controller = useController({
    control: textFieldProps.control,
    name: textFieldProps.field,
  });
  const field = controller.field;
  const value = field.value ?? [];
  return (
    <TextField {...textFieldProps} onChange={undefined} isFile>
      <FileTrigger
        acceptedFileTypes={
          acceptedFileTypes ?? ['image/png', 'image/jpg', 'image/jpeg']
        }
        allowsMultiple={allowsMultiple}
        defaultCamera={defaultCamera}
        onSelect={(selectedFiles) => {
          const fileArray = Array.from(selectedFiles ?? []);
          controller.field.onChange([
            ...value,
            ...fileArray.map((file) => ({
              file: file,
              url: URL.createObjectURL(file),
            })),
          ]);
        }}
      >
        {children(value)}
      </FileTrigger>
    </TextField>
  );
}

function Trigger({
  variant,
  size,
  ...racProps
}: VariantProps<typeof buttonVariants> & RACButtonProps) {
  return (
    <Button
      {...racProps}
      className={cn(buttonVariants({ variant, size }), racProps.className)}
    />
  );
}
export let FilePickerField = Object.assign(FilePickerFieldRoot, {
  Trigger,
});
