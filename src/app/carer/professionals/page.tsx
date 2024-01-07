import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { professionSchema } from '@/services/constants';
import { getProfessionals } from '@/services/professionals';
import { paginationParamsSchema } from '@/services/utils';
import Link from 'next/link';

const searchParamsSchema = paginationParamsSchema.extend({
  type: professionSchema.optional(),
});

function removeEmptyProperties(obj: { [k: string]: any }): {
  [k: string]: any;
} {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== ''),
  );
}

export default async function Professionals(props: { searchParams: unknown }) {
  const searchParams = searchParamsSchema.parse(props.searchParams);
  const { results: professionals } = await getProfessionals();
  const filtered = professionals.filter((v) =>
    searchParams.type ? v.professional.profession === searchParams.type : true,
  );

  return (
    <Tabs defaultValue={searchParams.type ?? 'all'}>
      <TabsList className="flex">
        <TabsTrigger value="all" asChild>
          <Link href="./professionals">All</Link>
        </TabsTrigger>
        <TabsTrigger value="counselor" asChild>
          <Link href={{ search: `type=counselor` }}>Counselor</Link>
        </TabsTrigger>
        <TabsTrigger value="psychologist" asChild>
          <Link href={{ search: `type=psychologist` }}>Psychologists</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-content" forceMount className="py-5">
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((professional) => (
            <li key={professional.id} className="h-full">
              <Card className="bg-white rounded-xl h-full flex flex-col justify-between">
                <CardContent className="flex flex-col items-center p-5">
                  <div className="space-y-4 flex flex-col items-center">
                    <Avatar className="w-40 h-40">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {[professional.first_name, professional.last_name]
                          .map((v) => v[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-center">
                        {professional.first_name} {professional.last_name}
                      </CardTitle>
                      <CardDescription className="text-center">
                        --RGC, Clinical EFT Certified-- No data
                      </CardDescription>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center mt-10">
                  <Button asChild variant="default" size="lg">
                    <Link href={`./professionals/${professional.id}`}>
                      View Info
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
