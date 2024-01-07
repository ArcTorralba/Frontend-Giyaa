import { cn } from '@/lib/utils';
import React from 'react';
import type { NumberFieldProps as RACNumberFieldProps } from 'react-aria-components';
import {
  Label,
  NumberField as RACNumberField,
  Text,
} from 'react-aria-components';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { get, useController, useFormState } from 'react-hook-form';

export type NumberFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = {
  control: Control<T>;
  field: TName;
  label?: React.ReactNode;
  withLabel?: boolean;
  description?: string;
  isFile?: boolean;
  children: React.ReactNode;
} & Omit<RACNumberFieldProps, 'children'>;

export default function NumberField<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  field,
  label,
  withLabel = false,
  description,
  isFile = false,
  children,
  ...racTextFieldProps
}: NumberFieldProps<T, TName>) {
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
    <RACNumberField
      {...racTextFieldProps}
      onChange={onChange}
      name={name}
      onBlur={onBlur}
      ref={ref}
      value={value}
      isDisabled={disabled}
      isInvalid={hasError}
      className={(rc) =>
        cn(
          typeof racTextFieldProps.className === 'function'
            ? racTextFieldProps.className(rc)
            : racTextFieldProps.className,
          'relative group',
        )
      }
    >
      <Label
        className={cn(
          'text-sm font-medium mb-2 block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          { 'sr-only': !withLabel },
        )}
      >
        {label}
      </Label>
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
    </RACNumberField>
  );
}
