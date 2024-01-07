'use client';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RouteDialog,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { invalidatePath, restAPI } from '@/services/api';
import { getSingleUser, userSchema } from '@/services/users';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { z } from 'zod';
import ProfessionalForm from '../../ProfessionalForm';
import { useParams, useRouter } from 'next/navigation';
import { professionSchema } from '@/services/constants';
import { getProfessional, professionalSchema } from '@/services/professionals';
import { removeEmptyProperties } from '@/lib/utils';

const payloadSchema = professionalSchema
  .omit({
    profile_photo: true,
    professional_id: true,
    professional: true,
  })
  .extend({
    profile_photo: z.instanceof(File).optional(),
    profession: professionSchema,
  });
type Payload = z.infer<typeof payloadSchema>;
const updateUser = async ({ id, ...user }: Payload) =>
  restAPI.url(`/users/${id}`).formData(removeEmptyProperties(user)).patch();
const useUpdateUser = () => useMutation(updateUser);

export default function NewUser() {
  const params = z.object({ id: z.coerce.number() }).parse(useParams());
  const user = useQuery(['professional', params.id], () =>
    getProfessional({ id: params.id }),
  ).data;

  const router = useRouter();
  const updateUser = useUpdateUser();
  const toaster = useToast();
  const isSubmitting = updateUser.isLoading;

  return (
    <RouteDialog>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Professional Account</DialogTitle>
          <DialogDescription>
            Update account for a professional
          </DialogDescription>
        </DialogHeader>
        {!!user && (
          <ProfessionalForm
            initialValue={{
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              description: user.description,
              photo: [{ url: user.profile_photo }],
              rate: 0,
              category: user.professional.profession,
              password: 'PLACEHOLDER',
            }}
            onSubmit={async (data) => {
              const photo = data.photo.find((v) => v.file)?.file;
              await updateUser.mutateAsync(
                {
                  id: user.id,
                  email: data.email,
                  is_staff: false,
                  description: data.description,
                  profession: data.category,
                  first_name: data.firstName,
                  last_name: data.lastName,
                  profile_photo: photo ?? undefined,
                },
                {
                  onSuccess: () => {
                    invalidatePath('/admin/users');
                    router.push('/admin/users');
                    toaster.toast({
                      title: 'User Updated!',
                    });
                  },
                  onError() {
                    toaster.toast({
                      title: 'Error',
                      description: 'Failed to update user.',
                    });
                  },
                },
              );
            }}
          />
        )}
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href=".">Cancel</Link>
          </Button>
          <Button type="submit" form="create-user-form" disabled={isSubmitting}>
            Update User
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteDialog>
  );
}
