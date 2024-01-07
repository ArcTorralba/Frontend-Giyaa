import * as React from 'react';

import { cn } from '@/lib/utils';

import { VariantProps, cva } from 'class-variance-authority';
import {
  TextArea as RACTextArea,
  TextAreaProps as RACTextAreaProps,
} from 'react-aria-components';

const textAreaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border data-[invalid]:border-destructive border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

export interface TextareaProps
  extends RACTextAreaProps,
    VariantProps<typeof textAreaVariants> {}
{
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <RACTextArea
        className={cn(textAreaVariants({ error, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
