import React from 'react';

export default function UsersLayout(props: {
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const { children, actions } = props;
  return (
    <>
      {actions}
      {children}
    </>
  );
}
