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
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import ToolkitForm from '../../ToolkitForm';
import { getToolkit } from '@/services/toolkits';
import { isFile } from '@/components/forms/file-drop-field';

const PayloadSchema = z.object({
  id: z.coerce.number(),
  title: z.string().max(200),
  description: z.string(),
  image_thumbnail: z.instanceof(File).optional(),
  professional_id: z.coerce.number(),
  newVideos: z.instanceof(File).array(),
  deletedVideos: z.coerce.number().array(),
});
const createToolkit = (payload: z.infer<typeof PayloadSchema>) => {
  const { newVideos, deletedVideos, image_thumbnail, id, ...data } = payload;
  const formData = new FormData();
  newVideos.forEach((file, index) => {
    formData.append(`videos[${index}]name`, file.name);
    formData.append(`videos[${index}]file`, file);
  });
  deletedVideos.forEach((id, index) => {
    formData.append(`videos[${index}]id`, String(id));
    formData.append(`videos[${index}]should_delete`, String(true));
  });

  if (image_thumbnail) {
    formData.append('image_thumbnail', image_thumbnail);
  }
  for (const key in data) {
    formData.append(key, String(data[key as keyof typeof data]));
  }
  return restAPI.url(`/toolkits/${id}`).body(formData).patch();
};
const useUpdateToolkit = () => useMutation(createToolkit);
const useToolkit = (id: number) =>
  useQuery(['toolkits', id], () => getToolkit(id), {
    enabled: !!id,
  });

const pageParamsSchema = z.object({ id: z.coerce.number().catch(0) });
export default function UpdateToolkit() {
  const params = pageParamsSchema.parse(useParams());
  const query = useToolkit(params.id);
  const toolkit = query.data;

  const router = useRouter();
  const updateToolkit = useUpdateToolkit();
  const toaster = useToast();
  const isSubmitting = updateToolkit.isLoading;

  return (
    <Dialog
      open
      onOpenChange={(open) => !isSubmitting && !open && router.replace('..')}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Toolkit</DialogTitle>
          <DialogDescription>Create material for consumption</DialogDescription>
        </DialogHeader>
        {query.isSuccess && !!toolkit && (
          <ToolkitForm
            initialValues={{
              title: toolkit.title,
              description: toolkit.description,
              professional_id: toolkit.professional.id,
              files: toolkit.videos.map((v) => ({ url: v.video, id: v.id })),
              thumbnail: [{ url: toolkit.image_thumbnail ?? undefined }],
            }}
            onSubmit={(data) => {
              const image = data.thumbnail.find((v) => v.file)?.file;
              const deletedVideos = toolkit.videos.filter(
                (video) => !data.files.find((file) => file.id !== video.id),
              );
              updateToolkit.mutateAsync(
                {
                  id: toolkit.id,
                  title: data.title,
                  description: data.description,
                  image_thumbnail: image ?? undefined,
                  newVideos: data.files.map((v) => v.file).filter(isFile),
                  deletedVideos: deletedVideos.map((v) => v.id),
                  professional_id: data.professional_id,
                },
                {
                  onSuccess() {
                    toaster.toast({ title: 'Toolkit Updated!' });
                    router.replace('..');
                  },
                  onError() {
                    toaster.toast({
                      title: 'Error!',
                      description: 'Failed to update toolkit',
                      variant: 'destructive',
                    });
                  },
                },
              );
            }}
          />
        )}
        <DialogFooter>
          <Button type="button" variant="ghost" asChild disabled={isSubmitting}>
            <Link href="..">Cancel</Link>
          </Button>
          <Button type="submit" form="new-toolkit-form" disabled={isSubmitting}>
            Update Toolkit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
