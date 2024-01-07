'use client';

import { FilePickerField, TextField } from '@/components/forms';
import { fileFieldSchema } from '@/components/forms/file-picker-field';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { restAPI } from '@/services/api';
import { userSchema } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { UserCircleIcon } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { Button as Pressable } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    firstName: z.string().trim().nonempty(),
    lastName: z.string().trim().nonempty(),
    email: z.string().trim().email(),
    description: z.string().trim().optional(),
    photo: fileFieldSchema,
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm'], // path of error
  });

type FormFields = z.infer<typeof schema>;

const editUserPayload = userSchema
  .omit({ professional_id: true, profile_photo: true })
  .extend({ profile_photo: z.instanceof(File) });

type Payload = z.infer<typeof editUserPayload>;
const editUser = ({ id, ...payload }: Payload) =>
  restAPI.url(`/users/${id}`).formData(payload).put();
const useEditUser = () => useMutation(editUser);

export function SettingsForm({
  initialValue,
}: {
  initialValue?: Partial<FormFields>;
}) {
  const form = useForm<FormFields>({
    defaultValues: initialValue ?? {},
    resolver: zodResolver(schema),
  });
  const editUser = useEditUser();
  const toaster = useToast();
  const onSubmit = form.handleSubmit(async (data) => {
    const session = await getSession();
    const photo = data.photo.find((v) => v.file)?.file;
    if (session && photo) {
      await editUser.mutateAsync(
        {
          id: session.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          is_staff: session.user.is_staff,
          profile_photo: photo,
        },
        {
          onSuccess() {
            toaster.toast({ title: 'Profile Updated!' });
          },
        },
      );
    }
  });
  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={onSubmit} className="grid gap-12 mt-4 max-w-xl w-full">
      <fieldset>
        <legend className="text-base font-semibold">Account Details</legend>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <FilePickerField
            control={form.control}
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
                <Pressable
                  type="button"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Change
                </Pressable>
              </div>
            )}
          </FilePickerField>
          <TextField
            control={form.control}
            field="firstName"
            label="First Name"
          >
            <Input type="text" placeholder="First Name" />
          </TextField>
          <TextField control={form.control} label="Last Name" field="lastName">
            <Input type="text" placeholder="Last Name" />
          </TextField>
          <TextField control={form.control} label="Email Address" field="email">
            <Input type="email" placeholder="Email" />
          </TextField>

          <div className="col-span-full">
            <TextField
              control={form.control}
              label="Description"
              field="description"
            >
              <Textarea placeholder="Description" />
            </TextField>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-base font-semibold">Privacy</legend>
        <div className="grid gap-4 mt-1">
          <TextField control={form.control} label="Password" field="password">
            <Input type="password" placeholder="Password " />
          </TextField>
          <TextField
            control={form.control}
            label="Confirm Password"
            field="confirmPassword"
          >
            <Input type="password" placeholder="Confirm Password " />
          </TextField>
        </div>
      </fieldset>
      <Button className="ml-auto" disabled={isSubmitting}>
        Save Changes
      </Button>
    </form>
  );
}
