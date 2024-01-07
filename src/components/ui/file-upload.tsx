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
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardTitle } from './card';
import { XIcon } from 'lucide-react';

const FILE_TYPE_VALUES = {
  'image/png': 'image/png',
  'image/jpg': 'image/jpg',
  'image/jpeg': 'image/jpeg',
} as const;

export default function FileUploadField({
  label,
  onChange: onChangeHandler,
}: {
  label: string;
  onChange?: (value: File[]) => void;
}) {
  const [files, setFiles] = useState<Array<{ content: File; url: string }>>([]);
  const handleChange = (files: File[]) => {
    if (onChangeHandler) {
      onChangeHandler(files);
    }
  };

  return (
    <div>
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
            ...files,
            ...droppedFiles.map((file) => ({
              content: file,
              url: URL.createObjectURL(file),
            })),
          ];
          setFiles(newValue);
          handleChange(newValue.map((v) => v.content));
        }}
      >
        <RACText slot="label" className="sr-only">
          {label}
        </RACText>
        <div className="relative flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md group-data-[hovered]:border-primary group-data-[hovered]:bg-green-50 group-data-[focus-visible]:border-primary group-data-[focus-visible]:bg-green-50 group-data-[drop-target]:bg-green-50">
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
                  const newValue = [
                    ...files,
                    ...parsedFiles.map((file) => ({
                      content: file,
                      url: URL.createObjectURL(file),
                    })),
                  ];
                  setFiles(newValue);
                  handleChange(newValue.map((v) => v.content));
                }}
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
        {files.map((file) => (
          <Item key={file.url}>
            <Card>
              <CardContent className="p-4 flex gap-4">
                <div className="w-14 h-14 rounded overflow-hidden">
                  <img
                    src={file.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start flex-1">
                  <div>
                    <CardTitle className="text-sm">
                      {file.content.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {(file.content.size / 1024 / 1024).toFixed(2)} MB
                    </CardDescription>
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
                      const newValue = files.filter(
                        (prevFile) => prevFile.url !== file.url,
                      );
                      setFiles(newValue);
                      handleChange(newValue.map((v) => v.content));
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
    </div>
  );
}
