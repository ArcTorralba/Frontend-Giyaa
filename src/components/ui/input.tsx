'use client';

import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  Input as RACInput,
  InputProps as RACInputProps,
} from 'react-aria-components';

const inputVariants = cva(
  'flex h-10 w-full rounded-md data-[invalid]:border-red-500 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-red-500',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

export interface InputProps
  extends RACInputProps,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flow-root relative">
        <RACInput
          type={visible ? 'text' : type}
          className={cn(inputVariants({ error, className }), {
            'pr-8': type === 'password',
          })}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              title="Toggle Password Visibility"
              onClick={() => setVisible((prev) => !prev)}
            >
              {!visible ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <EyeOffIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
