import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <Construction className="w-12 h-12 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      <p className="text-xs text-muted-foreground/70 mt-4">Este módulo será construído em breve.</p>
    </div>
  );
}
