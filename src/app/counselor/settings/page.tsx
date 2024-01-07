import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettingsForm from './AccountSettingsForm';
import { getUser } from '@/services/users';
import PricingSettingsForm from './PricingSettingsForm';

export default async function Settings() {
  const user = await getUser();

  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <section>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Make changes to your account here.
          </p>
          <div className="mt-8">
            <AccountSettingsForm
              initialValue={{
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                photo: user.profile_photo ? [{ url: user.profile_photo }] : [],
                description: user.description,
              }}
            />
          </div>
        </section>
      </TabsContent>
      <TabsContent value="pricing">
        <section>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Make changes to your pricing here.
          </p>
          <div className="mt-8">
            <PricingSettingsForm />
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
}
