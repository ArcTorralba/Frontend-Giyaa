import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RouteDialog,
} from '@/components/ui/dialog';
import { restAPI } from '@/services/api';
import { getProduct } from '@/services/products';
import { getUser } from '@/services/users';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const reportReasons = z.object({
  name: z.coerce.string(),
  value: z.coerce.string(),
});
const pageParams = z.object({
  id: z.coerce.number().catch(0),
});

export default async function BuyProduct(props: { params: unknown }) {
  const params = pageParams.parse(props.params);
  if (params.id === 0) {
    redirect('.');
  }
  const user = await getUser();
  const product = await getProduct(params.id);
  const options = reportReasons
    .array()
    .parse(await restAPI.get('/marketplace/report-reasons'));

  const buyProducts = async (formData: FormData) => {
    'use server';
    const validated = z.coerce
      .string()
      .array()
      .min(1)
      .safeParse(formData.getAll('reasons'));
    // Return early if the form data is invalid
    if (!validated.success) {
      return {
        errors: validated.error.flatten().formErrors,
      };
    }

    const reasons = validated.data;
    await Promise.all(
      reasons.map((reason) =>
        restAPI.url(`/marketplace/${product.id}/report_item`).post({
          reported_item: product.id,
          reported_by: user.carer_id,
          reason,
        }),
      ),
    );

    redirect('.');
  };

  return (
    <RouteDialog closeRoute=".">
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Product</DialogTitle>
          <DialogDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. 
          </DialogDescription>
        </DialogHeader>
        <form
      action={buyProducts}
      className="flex gap-4 py-4 flex-1"
      id="product-report-form"
    >
      <div className="grid gap-4 flex-1">
        <div className="flex flex-col mb-4 flex-1">
          <label htmlFor="name" className="text-sm text-gray-600 mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col mb-4 flex-1">
          <label htmlFor="contact" className="text-sm text-gray-600 mb-1">
            Contact:
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex flex-col mb-4 flex-1">
          <label htmlFor="email" className="text-sm text-gray-600 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border p-2 w-full"
            required
          />
        </div>
      </div>
    </form>
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href="." replace>
              Cancel
            </Link>
          </Button>
          <Button type="submit" form="product-report-form">
           Buy
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteDialog>
  );
}
