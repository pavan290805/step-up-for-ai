import RecruiterLayout from '@/Components/recruiter/RecruiterLayout';

export default function RecruiterAppLayout({ children }: { children: React.ReactNode }) {
  // In a real app, plan would come from auth/session context
  const plan = 'free'; // Change to 'premium' to see premium view

  return <RecruiterLayout plan={plan}>{children}</RecruiterLayout>;
}
