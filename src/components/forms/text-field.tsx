'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Label,
  TextField as RACTextField,
  TextFieldProps as RACTextFieldProps,
  Text,
} from 'react-aria-components';
import {
  Control,
  FieldPath,
  FieldValues,
  get,
  useController,
  useFormState,
} from 'react-hook-form';

export type TextFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = {
  control: Control<T>;
  field: TName;
  label?: string;
  description?: string;
  isFile?: boolean;
  children: React.ReactNode;
} & Omit<RACTextFieldProps, 'children'>;

export default function TextField<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  field,
  label,
  description,
  isFile = false,
  children,
  ...racTextFieldProps
}: TextFieldProps<T, TName>) {
  const controller = useController<T, TName>({
    control,
    name: field,
  });
  const formState = useFormState<T>({ control, name: field, exact: true });
  const getFieldErrror = () => {
    const error = get(formState.errors, field, '');
    if (!error) {
      return '';
    }
    const { message } = error;
    return message;
  };
  const error = getFieldErrror();
  const hasError = !!error;
  const { name, onBlur, onChange, ref, value, disabled } = controller.field;

  return (
    <RACTextField
      onChange={onChange}
      {...racTextFieldProps}
      name={name}
      onBlur={onBlur}
      ref={ref}
      value={isFile ? '' : value || ''}
      isDisabled={disabled}
      isInvalid={hasError}
      className={cn(racTextFieldProps.className, 'relative group')}
    >
      <Label className="sr-only">{label}</Label>
      {children}
      {!!description && !hasError && (
        <Text
          slot="description"
          elementType="p"
          className="text-sm text-muted-foreground mt-1"
        >
          {description}
        </Text>
      )}
      {!!error && (
        <Text
          className="text-sm mt-1 font-medium text-destructive"
          slot="errorMessage"
        >
          {error}
        </Text>
      )}
    </RACTextField>
  );
}
