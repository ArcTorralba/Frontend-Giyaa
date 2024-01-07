'use client';

import { TextField } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { restAPI } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { DollarSignIcon } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  price: z.coerce.number(),
});

type FormFields = z.infer<typeof schema>;

export const userSchema = z.object({
  id: z.coerce.number(),
  price: z.coerce.number(),
});
type User = z.infer<typeof userSchema>;
const editUser = ({ id, ...payload }: User) =>
  restAPI.url(`/users/${id}/pricing`).put(payload);
const useEditUser = () => useMutation(editUser);

export default function PricingSettingsForm({
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
    if (session) {
      await editUser.mutateAsync(
        {
          id: session.user.id,
          price: data.price,
        },
        {
          onSuccess(data, variables, context) {
            toaster.toast({ title: 'Profile Updated!' });
          },
        },
      );
    }
  });
  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={onSubmit} className="grid gap-12 mt-4 max-w-xl w-full">
      <TextField control={form.control} field="price" label="First Name">
        <div className="relative">
          <Input type="number" placeholder="Price" className="pl-8" />
          <span className="absolute left-0 inset-y-0 flex items-center px-3">
            <DollarSignIcon className="w-4 h-4 text-primary" />
          </span>
        </div>
      </TextField>
      <Button className="ml-auto" disabled={isSubmitting}>
        Save Changes
      </Button>
    </form>
  );
}
