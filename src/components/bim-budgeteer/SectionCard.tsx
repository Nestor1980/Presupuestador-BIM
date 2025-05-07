
import type { ReactNode } from 'react'; // Changed from "import type React from 'react';"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode; // Changed from React.ReactNode
  className?: string;
  headerActions?: ReactNode; // Changed from React.ReactNode
}

export function SectionCard({ title, description, icon: Icon, children, className, headerActions }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
            <CardTitle>{title}</CardTitle>
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

