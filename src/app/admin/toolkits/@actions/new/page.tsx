'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { restAPI } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import ToolkitForm from '../ToolkitForm';
import { isFile } from '@/components/forms/file-drop-field';

const CreateToolkitPayload = z.object({
  title: z.string().max(200),
  description: z.string(),
  image_thumbnail: z.instanceof(File),
  professional_id: z.coerce.number(),
  videos: z.instanceof(File).array(),
});
const createToolkit = (payload: z.infer<typeof CreateToolkitPayload>) => {
  const { videos, image_thumbnail, ...data } = payload;
  const formData = new FormData();
  Array.from(videos).forEach((file, index) => {
    formData.append(`videos[${index}]name`, file.name.split('.')[0]);
    formData.append(`videos[${index}]video`, file);
  });
  formData.append('image_thumbnail', image_thumbnail);
  for (const key in data) {
    formData.append(key, String(data[key as keyof typeof data]));
  }

  return restAPI.url('/toolkits').body(formData).post();
};
const useNewToolkit = () => useMutation(createToolkit);

export default function NewTookit() {
  const router = useRouter();
  const createToolkit = useNewToolkit();
  const toaster = useToast();
  const isSubmitting = createToolkit.isLoading;

  return (
    <Dialog
      open
      onOpenChange={(open) => !isSubmitting && !open && router.replace('.')}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Toolkit</DialogTitle>
          <DialogDescription>Create material for consumption</DialogDescription>
        </DialogHeader>
        <ToolkitForm
          onSubmit={(data) => {
            const image = data.thumbnail.find((v) => v.file)?.file;
            if (image) {
              createToolkit.mutateAsync(
                {
                  title: data.title,
                  description: data.description,
                  image_thumbnail: image,
                  videos: data.files.map((v) => v.file).filter(isFile),
                  professional_id: data.professional_id,
                },
                {
                  onSuccess() {
                    toaster.toast({ title: 'Toolkit Added!' });
                    router.replace('/admin/toolkits');
                  },
                  onError() {
                    toaster.toast({
                      title: 'Error!',
                      description: 'Failed to create toolkit',
                      variant: 'destructive',
                    });
                  },
                },
              );
            }
          }}
        />
        <DialogFooter>
          <Button type="button" variant="ghost" asChild disabled={isSubmitting}>
            <Link href=".">Cancel</Link>
          </Button>
          <Button type="submit" form="new-toolkit-form" disabled={isSubmitting}>
            Create Toolkit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
