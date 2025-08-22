import { Building } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building size={36} />
          <h1 className="text-3xl font-bold tracking-tight">BIM Budgeteer</h1>
        </div>
        <div className="h-20 w-20">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-md">
            <rect width="100" height="100" rx="12" fill="white"/>
            <path d="M20 80 V 25 H 80" stroke="#3498db" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="30" y="35" width="40" height="35" stroke="#3498db" strokeWidth="5" rx="4"/>
            <path d="M30 52.5 H 70" stroke="#3498db" strokeWidth="3" strokeLinecap="round"/>
            <path d="M50 35 V 70" stroke="#3498db" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
