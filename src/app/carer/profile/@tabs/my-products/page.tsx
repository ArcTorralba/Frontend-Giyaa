import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { getUserSession } from '@/services/auth';
import { getUserProducts } from '@/services/products';
import { getUser } from '@/services/users';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function UserProducts() {
  const user = await getUser();
  if (!user.carer_id) {
    redirect('/carer/home');
  }
  const { results: products } = await getUserProducts(user.carer_id);

  return (
    <div className="space-y-5">
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          My Products
        </h2>
        <Button asChild>
          <Link href="my-products/new">
            <span>
              <PlusIcon className="w-4 h-4" />
            </span>
            <span>Create Product</span>
          </Link>
        </Button>
      </div>
      <ul className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
