import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUser } from '@/services/users';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <section>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Make changes to your account here.
          </p>
          <SettingsForm
            initialValue={{
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              photo: user.profile_photo ? [{ url: user.profile_photo }] : [],
            }}
          />
        </section>
      </TabsContent>
    </Tabs>
  );
}
