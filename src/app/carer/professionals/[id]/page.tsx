import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import BookingForm from './BookingForm';
import { getProfessional, professionalSchema } from '@/services/professionals';
import { restAPI } from '@/services/api';
import { z } from 'zod';

const paramsSchema = z.object({ id: z.coerce.number() });
export default async function ProfessionalPage(props: { params: unknown }) {
  const params = paramsSchema.parse(props.params);
  const professional = await getProfessional({ id: params.id });

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 -mt-6">
      <section className="from-primary to-[#1AB08B] bg-gradient-to-b pb-20 pt-10 px-10 space-y-10">
        <Button asChild variant="link" className="whitespace-nowrap text-white">
          <Link href=".">
            <span>
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span>Go Back</span>
          </Link>
        </Button>
        <div className="flex gap-10">
          <Avatar className="w-48 h-48">
            <AvatarImage src="" />
            <AvatarFallback>
              {[professional.first_name, professional.last_name]
                .map((v) => v[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight transition-colors first:mt-0">
              {professional.first_name} {professional.last_name}
            </h2>
            <dl className="leading-7 [&:not(:first-child)]:mt-6 text-white space-y-1">
              <div className="flex gap-1 items-center">
                <dt aria-label="Address">
                  <MapPin className="w-4 h-4" />
                </dt>
                <dd>NO DATA--Obrero, Davao City</dd>
              </div>
              <div className="flex gap-1">
                <dt>Rate:</dt>
                <dd>NO DATA--PHP 2,500/hr</dd>
              </div>
              <div className="flex gap-1 relative">
                <dt className="sr-only">Description</dt>
                <dd>
                  --Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Neque corrupti tempora et impedit deleniti obcaecati dolorum
                  laboriosam dolores magni, voluptates sit. Modi fuga,
                  doloremque adipisci impedit cupiditate natus maxime tempora--
                  NO DATA--
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section className="p-8">
        <BookingForm professional={professional} />
      </section>
    </div>
  );
}
