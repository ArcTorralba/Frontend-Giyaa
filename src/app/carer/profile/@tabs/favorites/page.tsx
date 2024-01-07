import ProductCard from '@/components/ProductCard';
import { getFavoriteProducts } from '@/services/products';
import { getUser } from '@/services/users';

export default async function UserFavorites() {
  const user = await getUser();
  const favorites = await getFavoriteProducts(user.id);

  return (
    <div className="space-y-5">
      <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
        My Favorites
      </h2>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
