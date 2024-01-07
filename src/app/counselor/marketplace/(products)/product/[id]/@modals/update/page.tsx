import { Button } from '@/components/ui/button';
import {
  RouteDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getProduct } from '@/services/products';
import Link from 'next/link';
import { z } from 'zod';
import UpdateProductForm from './UpdateProductForm';

const paramsSchema = z.object({ id: z.coerce.number().catch(0) });
export default async function UpdateProduct(props: { params: unknown }) {
  const params = paramsSchema.parse(props.params);
  const product = await getProduct(params.id);

  return (
    <RouteDialog closeRoute=".">
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Complete the information neeeded to create a product and sell to the
            marketplace
          </DialogDescription>
        </DialogHeader>
        <UpdateProductForm
          product={product}
          initialValue={{
            name: product.name,
            category: product.category,
            contactNumber: product.contact_number,
            description: product.description,
            facebookHandle: product.facebook_url,
            images: product.image ? [{ url: product.image }] : [],
            location: product.location,
            price: product.price,
          }}
        />
        <DialogFooter>
          <Button type="button" variant="ghost" asChild>
            <Link href=".">Cancel</Link>
          </Button>
          <Button type="submit" form="create-product-form">
            Update Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteDialog>
  );
}
