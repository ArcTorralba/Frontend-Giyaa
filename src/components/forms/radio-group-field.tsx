import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import React, { PropsWithoutRef, useId } from 'react';
import type {
  LabelProps,
  RadioGroupProps,
  RadioProps,
  TextProps,
} from 'react-aria-components';
import {
  Label,
  Radio,
  RadioContext,
  RadioGroup,
  Text,
  useSlottedContext,
} from 'react-aria-components';
import {
  FieldPath,
  FieldValues,
  Control,
  useController,
  get,
  useFormState,
} from 'react-hook-form';

export type RadioGroupFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = {
  control: Control<T>;
  field: TName;
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
} & Omit<RadioGroupProps, 'children'>;

export default function RadioGroupFieldRoot<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  label,
  description,
  errorMessage,
  children,
  field,
  control,
  ...props
}: RadioGroupFieldProps<T, TName>) {
  const formState = useFormState({ control, name: field, exact: true });
  const controller = useController({ control, name: field });
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
    <RadioGroup
      {...props}
      ref={ref}
      value={value}
      name={name}
      isDisabled={disabled}
      isInvalid={hasError}
      onChange={onChange}
      className={cn(props.className, 'group')}
    >
      {label && <Label>{label}</Label>}
      {description && hasError && <Text slot="description">{description}</Text>}
      {children}
      {!!error && (
        <Text
          className="text-sm mt-1 font-medium text-destructive"
          slot="errorMessage"
        >
          {error}
        </Text>
      )}
    </RadioGroup>
  );
}

function RadioItem({
  children,
  withIndicator = true,
  ...radioProps
}: RadioProps & { withIndicator?: boolean }) {
  const id = useId();
  return (
    <RadioContext.Provider
      value={{
        'aria-describedby': id,
        slots: {
          radioDescription: {
            id: id,
          },
        },
      }}
    >
      <Radio
        {...radioProps}
        className={cn(
          radioProps.className,
          'flex items-start gap-2 group cursor-pointer',
        )}
        slot={null}
      >
        {(renderProps) => (
          <>
            {withIndicator && <Indicator />}
            {typeof children === 'function' ? children(renderProps) : children}
          </>
        )}
      </Radio>
    </RadioContext.Provider>
  );
}

function Indicator() {
  return (
    <div className="aspect-square h-4 w-4 shrink-0 flex items-center justify-center group-data-[selected]:text-white text-primary rounded-full border border-primary  group-data-[selected]:bg-primary  ring-offset-background group-data-[focused]:outline-none group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-ring group-data-[focus-visible]:ring-offset-2 group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-50">
      <CheckIcon className="h-3 w-3 " />
    </div>
  );
}
function RadioItemTitle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        props.className,
        'text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      )}
    />
  );
}

function RadioItemDescription(props: TextProps) {
  const { className, style, slot, ref, children, ...slottedProps } =
    useSlottedContext(RadioContext, props.slot) ?? {};

  return (
    <div
      {...slottedProps}
      {...props}
      className={cn('text-sm text-muted-foreground mt-2', props.className)}
    />
  );
}

export let RadioGroupField = Object.assign(RadioGroupFieldRoot, {
  Radio: RadioItem,
  Indicator,
  Description: RadioItemDescription,
  Title: RadioItemTitle,
});
