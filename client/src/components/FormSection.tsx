import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  highlight?: boolean;
}

export default function FormSection({ title, description, children, highlight }: FormSectionProps) {
  return (
    <Card className={`shadow-sm ${highlight ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-semibold ${highlight ? 'text-primary' : ''}`}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
