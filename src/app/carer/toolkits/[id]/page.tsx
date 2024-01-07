import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DialogContent } from '@/components/ui/dialog';
import { getToolkit } from '@/services/toolkits';
import { Dialog } from '@radix-ui/react-dialog';
import { Play } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import VideoPlayer from './VideoPlayer';

const pageParamsSchema = z.object({ id: z.coerce.number().catch(0) });
export default async function Toolkits(props: { params: unknown }) {
  const params = pageParamsSchema.parse(props.params);
  if (params.id === 0) {
    return redirect('/carer/toolkits');
  }

  const toolkit = await getToolkit(params.id);

  return (
    <div className="grid gap-5">
      <section className="aspect-w-16 aspect-h-6 bg-primary -mx-4 sm:-mx-6 md:-mx-8 -mt-6 ">
        <div className="flex items-center justify-center">
          <p className="text-5xl text-white font-bold">
            Explore and learn with our toolkits
          </p>
        </div>
      </section>
      <section>
        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <img
              src={toolkit.image_thumbnail}
              alt={toolkit.title}
              className="w-20 h-20 rounded overflow-hidden object-cover"
            />
            <div>
              <CardTitle className="flex-1 min-w-0 truncate m-0 text-lg">
                {toolkit.title}
              </CardTitle>
              <CardDescription>{toolkit.description}</CardDescription>
              <CardDescription>
                By:{toolkit.professional.user.first_name}{' '}
                {toolkit.professional.user.last_name}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4">
              {toolkit.videos.map((video, index) => (
                <li
                  key={video.id}
                  className="bg-white rounded-lg p-4 border flex justify-between items-center"
                >
                  <span>Video #{index + 1}</span>
                  <VideoPlayer url={video.video} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
