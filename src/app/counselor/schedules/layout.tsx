import React from 'react';

export default function SchedulesLayout({
  children,
  modals,
}: {
  children: React.ReactNode;
  modals: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modals}
    </>
  );
}
