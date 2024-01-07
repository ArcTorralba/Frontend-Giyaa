'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Required' })
    .min(1, { message: 'Required' }),
  password: z.string(),
  category: z.string(),
  description: z.string().optional(),
});
type FormFields = z.infer<typeof schema>;

export default function NewUser() {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const onSubmit = handleSubmit((data) => {
    alert('No Integration');
  });
  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={onSubmit}>
          <Label className="relative">
            <span className="sr-only">Name</span>
            <Input {...register('email')} placeholder="Temporary Email" />
          </Label>
          <Label className="relative">
            <span className="sr-only">Name</span>
            <Input {...register('password')} placeholder="Name" />
          </Label>
          <Label className="relative">
            <span className="sr-only">Name</span>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="carer">Carer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
          <Label className="relative">
            <span className="sr-only">Name</span>
            <Textarea {...register('email')} placeholder="Description" />
          </Label>
        </form>
        <DialogFooter>
          <Button type="submit">Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
