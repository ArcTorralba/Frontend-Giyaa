'use client';

import {
  Control,
  FieldPath,
  FieldValues,
  get,
  useForm,
  useFormState,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { restAPI } from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';


const schema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Required' })
    .min(1, { message: 'Required' }),
  password: z.string().trim().min(1, { message: 'Required' }),
});
type FormFields = z.infer<typeof schema>;

const useLogin = () =>
  useMutation((payload: FormFields) =>
    signIn('credentials', {
      ...payload,
      redirect: false,
    }),
  );

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState, control } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const getFieldErrror = (field: FieldPath<FormFields>) => {
    const error = get(formState.errors, field, '');
    if (!error) {
      return { message: '', hasError: false };
    }
    const { message } = error;
    return { message, hasError: !!message };
  };
  const login = useLogin();
  const errorMessage = !!login.data?.error;
  const onSubmit = handleSubmit(async (data) => {
    await login.mutateAsync(data, {
      async onSuccess(data, variables, context) {
        if (data?.error?.length !== undefined) {
          return;
        }
        const session = await getSession();
        if (session !== null) {
          switch (session.user.role) {
            case 'admin':
              router.push('/admin');
              break;
            case 'carer':
              router.push('/carer');
              break;
            case 'professional':
              router.push('/counselor');
              break;
            default:
              break;
          }
        }
      },
    });
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-3xl w-full mx-auto flex p-0 overflow-hidden">
        <section className="bg-gray-100 flex-1 px-14 py-10">
          {errorMessage && (
            <Alert variant="destructive" className="my-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Failed to Login</AlertTitle>
              <AlertDescription>
                The credentials you entered are incorrect
              </AlertDescription>
            </Alert>
          )}
          <form className="grid gap-7" onSubmit={onSubmit}>
            <div className=" space-y-5 flex flex-col items-center">
              <h1 className="text-3xl font-bold text-primary text-center">
                Sign In to Account
              </h1>
              <hr aria-hidden className="w-12 border-t-4 border-primary" />
            </div>
            <div className="grid gap-4">
              <Label className="relative">
                <span className="sr-only">Email</span>
                <Input
                  {...register('email')}
                  placeholder="Email"
                  error={getFieldErrror('email').hasError}
                />
                <ErrorMessage control={control} field="email" />
              </Label>
              <label className="relative">
                <span className="sr-only">Password</span>
                <Input
                  {...register('password')}
                  placeholder="Password"
                  type="password"
                  error={getFieldErrror('password').hasError}
                />
                <ErrorMessage control={control} field="password" />
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center w-full">
                <hr aria-hidden className="border-t border-gray-400 w-full" />
              </div>
              <div className="flex justify-center">
                <span className="bg-gray-100 text-center px-2 inline-block relative">
                  or use your email account
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Button disabled={formState.isSubmitting}>Login</Button>
              {/* <Button
                type="button"
                variant="outline"
                className="border-primary text-primary inline-flex space-x-2 hover:bg-green-50 hover:text-green-700"
              >
                <span>
                  <svg
                    className="w-4 h-4"
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="27" height="27" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlinkHref="#image0_735_231"
                          transform="scale(0.0078125)"
                        />
                      </pattern>
                      <image
                        id="image0_735_231"
                        width="128"
                        height="128"
                        xlinkHref="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </span>
                <span>Continue with Google</span>
              </Button> */}
            </div>
          </form>
        </section>
        <section className="from-primary to-[#1AB08B] max-w-xs bg-gradient-to-b px-10 text-white flex justify-center items-center">
          <div className="space-y-8">
            <div className=" space-y-5 flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center">Welcome Carer!</h1>
              <hr aria-hidden className="w-12 border-t-4 border-white" />
              <span className="text-center text-white">
                Sign Up and experience the services given by Giya
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent hover:text-primary"
              asChild
            >
              <Link href="register">Sign Up</Link>
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
