'use client';
import { FilePickerField, SelectField, TextField } from '@/components/forms';
import { fileFieldSchema } from '@/components/forms/file-picker-field';
import NumberField from '@/components/forms/number-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { invalidatePath, restAPI } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { UserCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heading } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const USER_PROFESSION_VALUES = {
  Counselor: 'counselor',
  Psychologist: 'psychologist',
} as const;
const useProfessionSchema = z.nativeEnum(USER_PROFESSION_VALUES);
const schema = z.object({
  email: z.string().nonempty().email(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  password: z.string().nonempty(),
  category: useProfessionSchema,
  description: z.string().optional(),
  rate: z.coerce.number().catch(0),
  photo: fileFieldSchema,
  specialization: z.string(),
});
type FormFields = z.infer<typeof schema>;

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  password: z.string(),
  profile_photo: z.instanceof(File),
  profession: useProfessionSchema,
  rate: z.coerce.number(),
  description: z.string().optional(),
});

const modifiableUserSchema = userSchema.omit({ id: true });
type User = z.infer<typeof modifiableUserSchema>;
const createUser = async (user: User) =>
  restAPI.url('/users/register-professional').formData(user).post();

const useNewUser = () => useMutation(createUser);

export default function NewUser() {
  const router = useRouter();
  const { register, handleSubmit, control, formState, watch } =
    useForm<FormFields>({
      resolver: zodResolver(schema),
    });
  const newUser = useNewUser();
  const toaster = useToast();
  const onSubmit = handleSubmit(
    async (data) => {
      const photo = data.photo.find((v) => v.file)?.file;
      if (photo) {
        await newUser.mutateAsync(
          {
            ...data,
            description: data.description,
            profession: data.category,
            first_name: data.firstName,
            last_name: data.lastName,
            profile_photo: photo,
          },
          {
            onSuccess: () => {
              invalidatePath('/admin/users');
              router.push('/admin/users');
              toaster.toast({
                title: 'User Created!',
              });
            },
            onError() {
              toaster.toast({
                title: 'Error',
                description: 'Failed to create a new user.',
              });
            },
          },
        );
      }
    },
    (err) => {
      console.log('err', err);
    },
  );

  return (
    <Dialog open onOpenChange={(open) => !open && router.replace('.')}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Professional Account</DialogTitle>
          <DialogDescription>
            Create an account for a professional
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-user-form"
          className="grid gap-8 py-4"
          onSubmit={onSubmit}
        >
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
              <TextField control={control} field="password" label="Password">
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
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href=".">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            disabled={formState.isSubmitting}
          >
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
