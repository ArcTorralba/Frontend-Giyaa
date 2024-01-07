import React, { useState } from 'react';
import {
  DropZone,
  FileTrigger,
  Label,
  Text as RACText,
  Button,
  ListBox,
  Item,
} from 'react-aria-components';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';
import { XIcon } from 'lucide-react';
import { TextField } from '.';
import {
  Control,
  FieldPath,
  FieldPathByValue,
  FieldValues,
  useController,
} from 'react-hook-form';
import { TextFieldProps } from './text-field';
import { z } from 'zod';

export const FILE_TYPE_VALUES = {
  'image/png': 'image/png',
  'image/jpg': 'image/jpg',
  'image/jpeg': 'image/jpeg',
  'video/mp4': 'video/mp4',
} as const;

export function isFile(fileLike: unknown): fileLike is File {
  return z.instanceof(File).safeParse(fileLike).success;
}

const fieldWithFile = z.object({
  file: z.instanceof(File),
  url: z.string().url().catch(''),
});
function doesFieldHaveFile(
  fileLikeObject: unknown,
): fileLikeObject is z.infer<typeof fieldWithFile> {
  return fieldWithFile.safeParse(fileLikeObject).success;
}

export const fileFieldSchema = z
  .object({
    file: z.instanceof(File).nullish(),
    url: z
      .string()
      .url()
      .nullish()
      .transform((x) => x ?? undefined),
    id: z.coerce.number().optional(),
  })
  .array();
export type FileFieldShape = z.infer<typeof fileFieldSchema>;

export default function FileUploadField<
  T extends FieldValues,
  TName extends FieldPathByValue<T, FileFieldShape>,
>({
  label,
  isFile = false,
  acceptedFiles,
  ...textFieldProps
}: Omit<TextFieldProps<T, TName>, 'children' | 'field' | 'control'> & {
  control: Control<T>;
  field: TName;
  acceptedFiles?: string[];
}) {
  const { field } = useController({
    control: textFieldProps.control,
    name: textFieldProps.field,
  });
  const [fieldValue, setFiles] = useState<FileFieldShape>(field.value ?? []);
  const controller = useController({
    control: textFieldProps.control,
    name: textFieldProps.field,
  });

  const { onChange } = controller.field;
  const handleChange = (newFiles: File[]) => {
    onChange(
      newFiles.map((newFile) => ({
        file: newFile,
        url: URL.createObjectURL(newFile),
      })),
    );
  };

  return (
    <TextField {...textFieldProps} isFile onChange={undefined}>
      <DropZone
        className="group"
        getDropOperation={(types) => {
          return Object.values(FILE_TYPE_VALUES).some((v) => types.has(v))
            ? 'copy'
            : 'cancel';
        }}
        onDrop={async (e) => {
          const droppedFiles = (
            await Promise.all(
              e.items.map(async (item) => {
                if (item.kind === 'file') {
                  return item.getFile();
                }
                return undefined;
              }),
            )
          ).filter((fileLike): fileLike is File => fileLike !== undefined);

          const newValue = [
            ...fieldValue,
            ...droppedFiles.map((file) => ({
              file: file,
              url: URL.createObjectURL(file),
            })),
          ];
          setFiles(newValue);
          onChange(newValue);
        }}
      >
        <div className="relative flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md  group-data-[focus-visible]:border-primary group-data-[invalid]:border-destructive group-data-[invalid]:bg-red-50 group-data-[focus-visible]:bg-green-50 group-data-[drop-target]:bg-green-50">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center text-sm text-gray-600">
              <FileTrigger
                onSelect={(selectedFiles) => {
                  let parsedFiles = Array.from(selectedFiles ?? []);
                  console.log('fieldValue', fieldValue);
                  const newValue = [
                    ...fieldValue,
                    ...parsedFiles.map((file) => ({
                      file: file,
                      url: URL.createObjectURL(file),
                    })),
                  ];
                  setFiles(newValue);
                  onChange(newValue);
                }}
                allowsMultiple
                acceptedFileTypes={acceptedFiles}
              >
                <Button
                  className={cn(
                    buttonVariants({
                      variant: 'link',
                      size: 'sm',
                      className: 'p-0',
                    }),
                  )}
                >
                  Upload a file
                </Button>
              </FileTrigger>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
          </div>
        </div>
      </DropZone>
      <ListBox
        aria-label="Selected product images"
        selectionMode="none"
        className="grid grid-flow-row gap-4 mt-4"
      >
        {fieldValue.map((file) => (
          <Item key={file.url}>
            <Card>
              <CardContent className="p-4 flex gap-4">
                <div className="w-14 h-14 rounded overflow-hidden">
                  <img
                    src={file?.url ?? ''}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start flex-1">
                  <div>
                    <CardTitle className="text-sm">
                      {file.file
                        ? file.file.name
                        : (file.url ?? '').split('/').slice(-1).join('')}
                    </CardTitle>
                    {!!file.file && (
                      <CardDescription className="text-sm">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    className={cn(
                      buttonVariants({
                        variant: 'destructive',
                        size: 'sm',
                      }),
                      'w-7 h-7 p-0',
                    )}
                    onPress={() => {
                      const newValue = fieldValue.filter(
                        (prevFile) => prevFile.url !== file.url,
                      );
                      setFiles(newValue);
                      onChange(newValue);
                      // handleChange(
                      //   newValue.filter(doesFieldHaveFile).map((v) => v.file),
                      // );
                    }}
                    aria-label="Remove File"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Item>
        ))}
      </ListBox>
    </TextField>
  );
}
