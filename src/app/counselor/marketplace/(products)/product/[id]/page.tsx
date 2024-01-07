import { Button, buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { priceFormatter } from '@/lib/utils';
import { getUserSession } from '@/services/auth';
import { getProduct } from '@/services/products';
import {
  ArrowLeft,
  Edit3Icon,
  FacebookIcon,
  FlagIcon,
  HeartIcon,
  PhoneCallIcon,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import FavoriteButton from './FavoriteButton';
import { restAPI } from '@/services/api';
import { getUser } from '@/services/users';
import { revalidatePath } from 'next/cache';

const paramsSchema = z.object({
  id: z.coerce.number().catch(0),
});
export default async function ProductDetails(props: { params: unknown }) {
  const user = await getUser();
  const params = paramsSchema.parse(props.params);
  if (params.id === 0) {
    redirect('/counselor/marketplace');
  }
  const product = await getProduct(params.id);
  const isUserOwned = product.created_by.user.id === user.id;
  const addToFavorites = async (formData: FormData) => {
    'use server';
    const id = z.coerce.number().parse(formData.get('productId'));
    await restAPI.url(`/marketplace/${id}/toggle-favorite`).post();
    revalidatePath(`/counselor/marketplace/product/${id}`);
  };

  const isFavorite = user.favorite_items.some((item) => item.id === product.id);

  return (
    <div>
      <Button asChild variant="link" className="whitespace-nowrap">
        <Link href="..">
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span>Go Back</span>
        </Link>
      </Button>
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-8 lg:items-start mt-5">
        {/* Image gallery */}
        <Tabs
          defaultValue={product.image ?? ''}
          className="flex flex-col-reverse relative col-span-3"
        >
          {/* Image selector */}
          {/* <div className=" mt-6 w-full mx-auto">
            <TabsList className="grid grid-cols-4 gap-6">
              {[product.image].map((image) => (
                <TabsTrigger
                  key={image}
                  value={image ?? ''}
                  className="relative h-24 border-0 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                  asChild
                >
                  <button>
                    <span className="sr-only">{product.name}</span>
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <img
                        src={image ?? ''}
                        alt={product.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                  </button>
                </TabsTrigger>
              ))}
            </TabsList>
          </div> */}

          <div className="w-full aspect-w-1 aspect-h-1 border rounded-xl overflow-hidden">
            {[product.image].map((image) => (
              <TabsContent value={image ?? ''} key={image} className="mt-0">
                <img
                  src={image ?? ''}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 col-span-2">
          <div>
            <h2 className="sr-only">Product Category</h2>
            <p className="text-sm uppercase tracking-wide text-gray-400">
              {product.category}
            </p>
          </div>
          <h1 className="text-3xl mt-3 font-extrabold tracking-tight text-gray-900 flex items-center justify-between">
            {product.name}
            {/* <Button
            className="ml-auto text-white px-2 py-1 rounded-md text-sm" 
            style={{ backgroundColor: "#1D9F49" }}
          >
            <span>Buy Now</span>
          </Button> */}
          {!isUserOwned && (
            <div className="mt-2 flex justify-center">
              <Link
                href={`${params.id}/buy`}
                className={buttonVariants({
                  variant: 'link',
                  className: 'shrink-0 text-gray-400 hover:text-red-500',
                })}
              >
                {/* <span>
                  <FlagIcon className="w-4 h-4" />
                </span> */}
                <span>Buy Now</span>
              </Link>
            </div>
          )}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">
              {priceFormatter().format(product.price)}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>

            <div
              className="text-base text-gray-700 space-y-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div className="mt-6">
            {/* Colors */}
            <div>
              <h3 className="text-sm text-gray-600">Location</h3>
              <span className="text-gray-500 hover:text-gray-700 hover:cursor-pointer">
                {product.location}
              </span>
            </div>
          </div>
          <div className="mt-6">
            {/* Colors */}
            <div>
              <h3 className="text-sm text-gray-600">Contact Information</h3>
              <div className="mt-3 space-y-2 flex flex-col">
                <div className="group inline-flex items-center text-base font-medium">
                  <PhoneCallIcon
                    className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-gray-500 hover:text-gray-700 hover:cursor-pointer">
                    {product.contact_number}
                  </span>
                </div>
                <div className="group inline-flex items-center text-base font-medium">
                  <FacebookIcon
                    className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <a
                    href={product.facebook_url}
                    className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    target="_blank"
                  >
                    The Facebook Page
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            {!isUserOwned && (
              <form action={addToFavorites}>
                <input type="hidden" name="productId" value={product.id} />
                <FavoriteButton initialValue={isFavorite} />
              </form>
            )}
            {isUserOwned && (
              <Link
                href={`${params.id}/update`}
                className={buttonVariants({
                  className: 'w-full flex-1 gap-1',
                  size: 'lg',
                })}
              >
                <span>
                  <Edit3Icon className="w-4 h-4" />
                </span>
                <span>Edit Product</span>
              </Link>
            )}
          </div>
          {!isUserOwned && (
            <div className="mt-2 flex justify-center">
              <Link
                href={`${params.id}/report`}
                className={buttonVariants({
                  variant: 'link',
                  className: 'shrink-0 text-gray-400 hover:text-red-500',
                })}
              >
                <span>
                  <FlagIcon className="w-4 h-4" />
                </span>
                <span>Report Product</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
