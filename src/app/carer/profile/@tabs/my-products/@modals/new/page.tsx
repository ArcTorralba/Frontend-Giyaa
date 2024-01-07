'use client';
import { FileDropField, InputField, SelectField } from '@/components/forms';
import { fileFieldSchema } from '@/components/forms/file-picker-field';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { restAPI } from '@/services/api';
import { productSchema } from '@/services/products';
import { getUser } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().nonempty({ message: 'Required' }),
  price: z.string().nonempty({ message: 'Required' }),
  location: z.string().nonempty({ message: 'Required' }),
  category: z.string(),
  description: z.string(),
  contactNumber: z.string().nonempty({ message: 'Required' }),
  facebookHandle: z.string().url().optional(),
  images: fileFieldSchema,
});

const productPayloadSchema = productSchema
  .omit({
    id: true,
    image: true,
    created_by: true,
  })
  .extend({ image: z.instanceof(File), created_by_id: z.coerce.number() });
type FormFields = z.infer<typeof schema>;

type Payload = z.infer<typeof productPayloadSchema>;
const useCreateProduct = () =>
  useMutation((payload: Payload) => {
    return restAPI.url('/marketplace').formData(payload).post();
  });

export default function CreateProduct() {
  const router = useRouter();
  const { handleSubmit, control, watch } = useForm<FormFields>({
    defaultValues: { images: [] },
    resolver: zodResolver(schema),
  });
  const createProduct = useCreateProduct();
  const toast = useToast();
  const onSubmit = handleSubmit(async (data) => {
    const image = data.images.find((v) => v.file)?.file;
    const user = await getUser();
    if (image && user) {
      createProduct.mutateAsync(
        {
          name: data.name,
          description: data.description,
          contact_number: data.contactNumber,
          category: data.category,
          price: Number(data.price),
          image: image,
          facebook_url: data.facebookHandle ?? '',
          created_by_id: user.id,
          flagged: false,
          location: data.location,
        },
        {
          onSuccess() {
            toast.toast({ title: 'Product Created' });
            router.push('..');
          },
        },
      );
    }
  });

  const close = () => router.push('.');

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Complete the information neeeded to create a product and sell to the
            marketplace
          </DialogDescription>
        </DialogHeader>

        {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
        <form
          id="create-product-form"
          className="grid gap-6"
          onSubmit={onSubmit}
        >
          <section className="grid gap-2">
            <h4 className="text-lg font-semibold tracking-tight">
              Product Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField control={control} field="name">
                <Input placeholder="Name" />
              </InputField>
              <InputField control={control} field="price">
                <Input placeholder="Price" />
              </InputField>
              <InputField control={control} field="location">
                <Input placeholder="Location" />
              </InputField>
              <SelectField
                control={control}
                field="category"
                placeholder="Select Category"
              >
                {[
                  { label: 'Artwork', key: 'artwork' },
                  { label: 'Clothes', key: 'clothes' },
                  { label: 'Others', key: 'others' },
                ].map((item) => (
                  <SelectField.Item value={item.key} key={item.key}>
                    {item.label}
                  </SelectField.Item>
                ))}
              </SelectField>
              <InputField
                className="col-span-full"
                control={control}
                field="description"
              >
                <Textarea placeholder="Description" />
              </InputField>
            </div>
          </section>
          <section>
            <h4 className="text-lg font-semibold tracking-tight">
              Product Images
            </h4>
            <div className="mt-2 col-span-full">
              <FileDropField control={control} field="images" />
            </div>
          </section>
          <section className="grid gap-2">
            <h4 className="text-lg font-semibold tracking-tight">
              Contact Information
            </h4>
            <div className="grid gap-4">
              <InputField control={control} field="contactNumber">
                <Input placeholder="Mobile Number" />
              </InputField>
              <InputField control={control} field="facebookHandle">
                <Input placeholder="Facebook Profile(Optional)" />
              </InputField>
            </div>
          </section>
        </form>
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href=".">Cancel</Link>
          </Button>
          <Button type="submit" form="create-product-form">
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
