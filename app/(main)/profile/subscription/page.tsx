import { getSubscription, getFeatureUsage } from '@/lib/subscription';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function SubscriptionPage() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  const subscription = await getSubscription(user.id);
  const assessmentUsage = await getFeatureUsage(user.id, 'assessment_generation');
  const documentUsage = await getFeatureUsage(user.id, 'document_generation');
  const ebookUsage = await getFeatureUsage(user.id, 'ebook_summarization');

  return (
    <div>
      <h1>Subscription</h1>
      {subscription ? (
        <div>
          <h2>{subscription.subscription.name}</h2>
          <p>Price: ${subscription.subscription.price}/month</p>
          <h3>Usage</h3>
          <ul>
            <li>
              Assessment Generation: {assessmentUsage?.usage || 0} / {(subscription.subscription.features as any).assessment_generation || 'Unlimited'}
            </li>
            <li>
              Document Generation: {documentUsage?.usage || 0} / {(subscription.subscription.features as any).document_generation || 'Unlimited'}
            </li>
            <li>
              Ebook Summarization: {ebookUsage?.usage || 0} / {(subscription.subscription.features as any).ebook_summarization || 'Unlimited'}
            </li>
          </ul>
        </div>
      ) : (
        <p>No subscription found.</p>
      )}
    </div>
  );
}
