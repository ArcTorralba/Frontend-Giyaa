import React, { useId } from 'react';
import { TextField as InputField } from '.';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { TextFieldProps } from './text-field';
import { Switch, SwitchProps } from 'react-aria-components';
import { cn } from '@/lib/utils';

export function SwitchFieldRoot<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  label,
  description,
  isFile = false,
  // children,
  ...racProps
}: Omit<TextFieldProps<T, TName>, 'children'>) {
  const descriptionId = useId();
  const { field } = useController({
    control: racProps.control,
    name: racProps.field,
  });

  return (
    <InputField {...racProps} onChange={undefined}>
      <Switch
        className={cn('group flex gap-2', {
          'items-start': description,
          'items-center': !description,
        })}
        aria-describedby={description ? descriptionId : undefined}
        name={field.name}
        ref={field.ref}
        isSelected={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
      >
        <div className="pt-1">
          <div className="flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full shadow-inner bg-clip-padding border border-solid border-white/30 p-[3px] box-border transition duration-200 ease-in-out bg-input group-data-[pressed]:bg-gray-300 group-data-[selected]:bg-primary group-data-[selected]:group-data-[pressed]:bg-green-900 outline-none group-focus-visible:ring-2 ring-black">
            <span className="h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-0 group-data-[selected]:translate-x-[100%]" />
          </div>
        </div>
        <div>
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </span>
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </Switch>
    </InputField>
  );
}

export let SwitchField = Object.assign(SwitchFieldRoot, {});
