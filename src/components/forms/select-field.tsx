'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Label,
  Select as RACSelecfField,
  Text,
  SelectContext,
  useContextProps,
  ButtonContext,
  ButtonProps,
} from 'react-aria-components';
import {
  Control,
  FieldPath,
  FieldValues,
  get,
  useController,
  useFormState,
} from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type SelectFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = {
  control: Control<T>;
  field: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  children: React.ReactNode;
};

const Trigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & Pick<SelectFieldProps, 'placeholder'> & { isPressed?: boolean }
>((props, ref) => {
  [props, ref] = useContextProps(props, ref, ButtonContext);
  const {
    onPress,
    onPressChange,
    onPressEnd,
    onPressStart,
    onPressUp,
    onKeyDown,
    onKeyUp,
    slot,
    className,
    style,
    placeholder,
    excludeFromTabOrder,
    isDisabled,
    isPressed,
    ...triggerProps
  } = props;

  return (
    <SelectTrigger
      ref={ref}
      {...triggerProps}
      disabled={isDisabled}
      className="group-data-[invalid]:border-red-500"
      placeholder={placeholder}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );
});
Trigger.displayName = 'Trigger';

export function SelectFieldRoot<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  field,
  label,
  description,
  placeholder,
  children,
}: SelectFieldProps<T, TName>) {
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
    <RACSelecfField isInvalid={hasError} className="group">
      <Select
        name={name}
        value={String(value)}
        onValueChange={onChange}
        disabled={disabled}
      >
        <Label className="sr-only">{label}</Label>
        <Trigger ref={ref} placeholder={placeholder} />
        {!!description && !hasError && (
          <Text slot="description" className="text-sm text-muted-foreground">
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
        <SelectContent>{children}</SelectContent>
      </Select>
    </RACSelecfField>
  );
}

export let SelectField = Object.assign(SelectFieldRoot, { Item: SelectItem });
