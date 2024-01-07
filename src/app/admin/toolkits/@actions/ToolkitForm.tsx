'use client';
import {
  FileDropField,
  FilePickerField,
  SelectField,
  SwitchField,
  TextField,
} from '@/components/forms';
import {
  FILE_TYPE_VALUES,
  fileFieldSchema,
} from '@/components/forms/file-drop-field';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProfessionals } from '@/services/professionals';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Group, Button as Pressable } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().nonempty({ message: 'Required' }),
  description: z.string().nonempty({ message: 'Required' }),
  thumbnail: fileFieldSchema,
  professional_id: z.coerce.number(),
  files: fileFieldSchema,
  isFree: z.boolean().default(false),
});
type FormFields = z.infer<typeof schema>;

export default function ToolkitForm({
  onSubmit: onSubmitHandler,
  initialValues,
}: {
  initialValues?: Partial<FormFields>;
  onSubmit: (data: FormFields) => PromiseLike<void> | void;
}) {
  const form = useForm<FormFields>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });
  const { handleSubmit, control } = form;
  const onSubmit = handleSubmit(onSubmitHandler);

  return (
    <form id="new-toolkit-form" className="grid gap-4 py-4" onSubmit={onSubmit}>
      <TextField control={control} field="title">
        <Input placeholder="Title" />
      </TextField>
      <TextField control={control} field="description">
        <Textarea placeholder="Description" />
      </TextField>
      <SelectField
        control={control}
        field="professional_id"
        placeholder="Select Professional"
      >
        <Suspense fallback={null}>
          <ProfessionalOptions />
        </Suspense>
      </SelectField>
      <Group>
        <Label>Thumbnail</Label>
        <FilePickerField
          control={form.control}
          field="thumbnail"
          label="Photo"
          className="col-span-full"
        >
          {(files) => (
            <div className="mt-2 flex items-center gap-x-3">
              <div className="h-20 w-20 overflow-hidden bg-gray-100 rounded">
                {files.length !== 0 && files[0].url ? (
                  <img
                    src={files[0].url}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <Pressable
                type="button"
                className={buttonVariants({ variant: 'outline' })}
              >
                Select Image
              </Pressable>
            </div>
          )}
        </FilePickerField>
      </Group>
      <FileDropField
        control={control}
        acceptedFiles={[FILE_TYPE_VALUES['video/mp4']]}
        field="files"
        label="Toolkit Files"
      />
      {/* <Card>
        <CardContent className="flex items-center p-4">
          <SwitchField
            control={control}
            field="isFree"
            label="Included for Free?"
            description="Make this content available for every user."
          />
        </CardContent>
      </Card> */}
    </form>
  );
}

function ProfessionalOptions() {
  const query = useQuery(['professionals'], getProfessionals, {
    suspense: true,
    cacheTime: 5000,
  });
  const options = query.data?.results ?? [];
  return options.map((opt) => (
    <SelectField.Item
      key={opt.id}
      value={String(opt.professional.id)}
      textValue={`${opt.first_name} ${opt.last_name}`}
    >
      {opt.first_name} {opt.last_name}
    </SelectField.Item>
  ));
}
