'use client';

import { RadioGroupField, TextField } from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { restAPI } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  get,
  useForm,
  useFormState,
} from 'react-hook-form';
import { z } from 'zod';

const payloadSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().trim().email({ message: 'Required' }),
  password: z.string().trim().nonempty(),
});

type Payload = z.infer<typeof payloadSchema>;
const useRegister = () =>
  useMutation((payload: Payload) =>
    restAPI.url('/auth/register').post(payload),
  );

const schema = z
  .object({
    firstname: z.string().nonempty({ message: 'Required' }),
    lastname: z.string().nonempty({ message: 'Required' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Required' })
      .nonempty({ message: 'Required' }),
    password: z.string().trim().nonempty({ message: 'Required' }),
    confirmPassword: z.string().trim().nonempty({ message: 'Required' }),
    hasAttendedCounselling: z
      .enum(['yes', 'no'], {
        required_error: 'Please select answer.',
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  })
  .refine((data) => data.hasAttendedCounselling !== undefined, {
    message: 'Please Select',
    path: ['hasAttendedCounselling'],
  });

type FormFields = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { watch, handleSubmit, formState, control, trigger } =
    useForm<FormFields>({
      defaultValues: { hasAttendedCounselling: 'no' },
      resolver: zodResolver(schema),
    });

  const signUp = useRegister();
  const { toast } = useToast();
  const onSubmit = handleSubmit(
    async (data) => {
      await signUp.mutateAsync(
        {
          first_name: data.firstname,
          last_name: data.lastname,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess() {
            toast({
              title: 'Registration Complete!',
              description: 'You can now login',
            });
            router.push(
              `/login?${
                data.hasAttendedCounselling === 'no' &&
                'redirectTo=/carer/professionals'
              }`,
            );
          },
        },
      );
    },
    (err) => {
      console.log('err', err);
    },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      <Card className="flex p-0 max-w-4xl w-full mx-auto overflow-hidden">
        <section className="bg-gray-100 flex-1 px-14 py-10">
          <form className="flex flex-col gap-8 h-full" onSubmit={onSubmit}>
            <div className=" space-y-5 flex flex-col items-center">
              <h1 className="text-3xl font-bold text-primary text-center">
                Create an Account
              </h1>
              <hr aria-hidden className="w-12 border-t-4 border-primary" />
            </div>
            {signUp.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Registration failed. Try again
                </AlertDescription>
              </Alert>
            )}
            <section className={cn('flex-1', { hidden: currentStep !== 1 })}>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  control={control}
                  field="firstname"
                  label="First Name"
                >
                  <Input placeholder="First Name" />
                </TextField>
                <TextField control={control} field="lastname" label="Last Name">
                  <Input placeholder="Last Name" />
                </TextField>
                <TextField
                  control={control}
                  field="email"
                  label="Email Address"
                  className="col-span-full"
                >
                  <Input placeholder="Email Address" />
                </TextField>
                <TextField
                  control={control}
                  field="password"
                  label="Password"
                  className="col-span-full"
                >
                  <Input placeholder="Password" type="password" />
                </TextField>
                <TextField
                  control={control}
                  field="confirmPassword"
                  label="Confirm Password"
                  className="col-span-full"
                >
                  <Input placeholder="Confirm Password" type="password" />
                </TextField>
                <Button
                  className="col-span-full w-full"
                  type="button"
                  onClick={async () => {
                    const result = await trigger();
                    console.log('result', result);
                    if (result) {
                      setCurrentStep(2);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </section>
            <section
              className={cn('flex-1 flex-col gap-8 justify-center', {
                hidden: currentStep !== 2,
                flex: currentStep === 2,
              })}
            >
              <fieldset>
                <legend className="text-lg font-bold text-center">
                  Have you already attended counseling?
                </legend>
                <RadioGroupField
                  control={control}
                  field="hasAttendedCounselling"
                  className="flex flex-col items-center"
                  defaultValue="no"
                >
                  <div className="flex gap-4 justify-center">
                    <RadioGroupField.Radio value="yes">
                      <RadioGroupField.Title>Yes</RadioGroupField.Title>
                    </RadioGroupField.Radio>
                    <RadioGroupField.Radio value="no">
                      <RadioGroupField.Title>No</RadioGroupField.Title>
                    </RadioGroupField.Radio>
                  </div>
                </RadioGroupField>
              </fieldset>
              <div className="grid-cols-2 grid gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={currentStep === 1}>
                  Create Account
                </Button>
              </div>
            </section>
          </form>
        </section>
        <section className="from-primary to-[#1AB08B] max-w-xs bg-gradient-to-b px-10 text-white flex justify-center items-center">
          <div className="space-y-8">
            <div className=" space-y-5 flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center">
                Already have an Account?
              </h1>
              <hr aria-hidden className="w-12 border-t-4 border-white" />
              <span className="text-center text-white">
                Sign in using your created account
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent hover:text-primary"
              asChild
            >
              <Link href="login">Log in</Link>
            </Button>
          </div>
        </section>
      </Card>
    </main>
  );
}

function ErrorMessage<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  field,
}: // children,
{
  control: Control<T>;
  field: TName;
  // children: (message: string) => React.ReactNode;
}) {
  const { errors } = useFormState({ control, name: field, exact: true });
  const error = get(errors, field, '');

  if (!error) {
    return null;
  }
  const { message: messageFromRegister } = error;
  return <p className="text-red-500 text-sm mt-2">{messageFromRegister}</p>;
  // return <>{children(messageFromRegister)}</>;
}
