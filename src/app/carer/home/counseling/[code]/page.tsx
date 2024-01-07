import CounselingCall from '@/components/CounselingCall';
import { restAPI } from '@/services/api';
import { redirect } from 'next/navigation';
import React from 'react';
import { z } from 'zod';

const paramsSchema = z.object({ code: z.coerce.string().catch('') });
const tokenSchema = z.object({ token: z.coerce.string() });

export default async function EnterRoom(props: { params: unknown }) {
  const params = paramsSchema.parse(props.params);
  if (!params.code) {
    redirect('/carer/home');
  }

  const { token } = tokenSchema.parse(
    await restAPI
      .url('/appointments/get-appointment-token/')
      .query({ code: params.code })
      .get(),
  );

  return <CounselingCall token={token} />;
}
