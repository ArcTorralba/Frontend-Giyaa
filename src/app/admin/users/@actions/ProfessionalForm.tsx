'use client';
import { FilePickerField, SelectField, TextField } from '@/components/forms';
import { fileFieldSchema } from '@/components/forms/file-picker-field';
import NumberField from '@/components/forms/number-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { professionSchema } from '@/services/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const USER_PROFESSION_VALUES = {
  Counselor: 'counselor',
  Psychologist: 'psychologist',
} as const;
const schema = z.object({
  email: z.string().nonempty().email(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  password: z.string().nonempty(),
  category: professionSchema,
  description: z.string().optional(),
  rate: z.coerce.number().catch(0),
  photo: fileFieldSchema,
  specialization: z.string().optional(),
});
type FormFields = z.infer<typeof schema>;

export default function ProfessionalForm({
  initialValue,
  onSubmit: onSubmitHandler,
}: {
  initialValue?: Partial<FormFields>;
  onSubmit: (data: FormFields) => PromiseLike<void>;
}) {
  const { handleSubmit, control } = useForm<FormFields>({
    defaultValues: initialValue,
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit(onSubmitHandler);
  const isUpdate = !!initialValue;
  return (
    <form id="create-user-form" className="grid gap-8 py-4" onSubmit={onSubmit}>
      <fieldset className="col-span-full">
        <Label className="col-span-full" asChild>
          <legend>User Information</legend>
        </Label>
        <div className="grid grid-cols-2 mt-2 gap-4">
          <FilePickerField
            control={control}
            field="photo"
            label="Photo"
            className="col-span-full"
          >
            {(files) => (
              <div className="mt-2 flex items-center gap-x-3">
                <div className="h-12 w-12 overflow-hidden bg-gray-100 rounded-full">
                  {files.length !== 0 && files[0].url ? (
                    <img
                      src={files[0].url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon
                      className="text-primary w-full h-full"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <FilePickerField.Trigger type="button" variant="outline">
                  Choose Image
                </FilePickerField.Trigger>
              </div>
            )}
          </FilePickerField>
          <TextField control={control} field="firstName" label="First Name">
            <Input placeholder="First Name" />
          </TextField>
          <TextField control={control} field="lastName" label="Last Name">
            <Input placeholder="Last Name" />
          </TextField>
          <TextField control={control} field="email" label="Email">
            <Input placeholder="Email" />
          </TextField>
          <TextField
            control={control}
            isDisabled={isUpdate}
            field="password"
            label="Password"
          >
            <Input type="password" placeholder="Password" />
          </TextField>
          <TextField
            control={control}
            field="description"
            label="Description"
            className="col-span-full"
          >
            <Textarea placeholder="Description" />
          </TextField>
        </div>
      </fieldset>
      <fieldset>
        <Label className="col-span-full" asChild>
          <legend>Profession Details</legend>
        </Label>
        <div className="grid grid-cols-2 mt-2 gap-4">
          <SelectField
            control={control}
            field="category"
            placeholder="Select Category"
          >
            {Object.entries(USER_PROFESSION_VALUES).map(([value, id]) => (
              <SelectField.Item key={value} value={id}>
                {value}
              </SelectField.Item>
            ))}
          </SelectField>
          <NumberField control={control} field="rate" label="Rate">
            <Input placeholder="Rate per hour" />
          </NumberField>
          <TextField
            control={control}
            field="specialization"
            label="Email"
            description="What field of study does this professional excel at"
            className="col-span-full"
          >
            <Input placeholder="Specialization" />
          </TextField>
        </div>
      </fieldset>
    </form>
  );
}
