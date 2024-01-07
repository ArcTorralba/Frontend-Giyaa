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

export default async function ReportProduct(props: { params: unknown }) {
  const params = pageParams.parse(props.params);
  if (params.id === 0) {
    redirect('.');
  }
  const user = await getUser();
  const product = await getProduct(params.id);
  const options = reportReasons
    .array()
    .parse(await restAPI.get('/marketplace/report-reasons'));

  const reportProducts = async (formData: FormData) => {
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
          <DialogTitle>Report Product</DialogTitle>
          <DialogDescription>
            Encountered an issue with this product? Let us know. Your feedback
            helps us improve.
          </DialogDescription>
        </DialogHeader>
        <form
          action={reportProducts}
          className="flex gap-4 py-4"
          id="product-report-form"
        >
          <fieldset className="relative">
            <legend className="sr-only">Select an issue</legend>
            <div className="grid gap-4">
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    id={option.value}
                    name="reasons"
                    value={option.value}
                  />
                  <label
                    htmlFor={option.value}
                    className="ml-3 select-none text-sm text-gray-600"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </form>
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href="." replace>
              Cancel
            </Link>
          </Button>
          <Button type="submit" form="product-report-form">
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteDialog>
  );
}
