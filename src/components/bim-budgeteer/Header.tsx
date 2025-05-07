import { Building } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center space-x-3">
        <Building size={36} />
        <h1 className="text-3xl font-bold tracking-tight">BIM Budgeteer</h1>
      </div>
    </header>
  );
}
