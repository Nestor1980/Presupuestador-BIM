import { Building } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building size={36} />
          <h1 className="text-3xl font-bold tracking-tight">BIM Budgeteer</h1>
        </div>
        <div className="relative h-20 w-40">
          <Image
            src="/logo.png"
            alt="Company Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </header>
  );
}
