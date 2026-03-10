import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Users, DollarSign, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import type { Activity } from '@/types/database';

interface DashboardStats {
  totalContacts: number;
  openDeals: number;
  totalDealValue: number;
  openConversations: number;
  pendingActivities: number;
}

export default function DashboardPage() {
  const { member, organization } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', organization?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!organization?.id) throw new Error('Sem organização');

      const [contacts, deals, conversations, activities] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('deals').select('id, value', { count: 'exact' }).eq('status', 'open').is('deleted_at', null),
        supabase.from('conversations').select('id', { count: 'exact', head: true }).in('status', ['open', 'waiting_client', 'waiting_internal']),
        supabase.from('activities').select('id', { count: 'exact', head: true }).is('completed_at', null),
      ]);

      const totalDealValue = (deals.data as unknown as Array<{ value: number }>)?.reduce((sum, d) => sum + Number(d.value), 0) ?? 0;

      return {
        totalContacts: contacts.count ?? 0,
        openDeals: deals.count ?? 0,
        totalDealValue,
        openConversations: conversations.count ?? 0,
        pendingActivities: activities.count ?? 0,
      };
    },
    enabled: !!organization?.id,
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const cards = [
    { title: 'Contatos', value: stats?.totalContacts ?? 0, icon: Users, color: 'bg-blue-50 text-blue-600', href: '/contatos' },
    { title: 'Deals abertos', value: stats?.openDeals ?? 0, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', href: '/pipeline' },
    { title: 'Valor no pipeline', value: formatCurrency(stats?.totalDealValue ?? 0), icon: DollarSign, color: 'bg-green-50 text-green-600', href: '/pipeline' },
    { title: 'Conversas abertas', value: stats?.openConversations ?? 0, icon: MessageSquare, color: 'bg-orange-50 text-orange-600', href: '/inbox' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Olá, {member?.display_name || 'Usuário'}</h1>
        <p className="text-sm text-muted-foreground mt-1">Aqui está o resumo do seu CRM hoje.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Atividades pendentes</h2>
          <span className="text-sm text-muted-foreground">
            {isLoading ? '...' : `${stats?.pendingActivities ?? 0} pendentes`}
          </span>
        </div>
        <PendingActivities />
      </div>
    </div>
  );
}

interface ActivityWithRelations extends Activity {
  deal: { title: string } | null;
  contact: { name: string } | null;
}

function PendingActivities() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*, deal:deals(title), contact:contacts(name)')
        .is('completed_at', null)
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as unknown as ActivityWithRelations[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Nenhuma atividade pendente.</p>
        <p className="text-xs mt-1">Crie atividades nos seus deals para acompanhar aqui.</p>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    task: 'Tarefa', call: 'Ligação', email: 'Email', meeting: 'Reunião', note: 'Nota', whatsapp: 'WhatsApp',
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return { text: 'Sem prazo', color: 'text-muted-foreground' };
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d atrasada`, color: 'text-destructive' };
    if (diffDays === 0) return { text: 'Hoje', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Amanhã', color: 'text-yellow-600' };
    return { text: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), color: 'text-muted-foreground' };
  };

  return (
    <div className="divide-y divide-border">
      {activities.map((activity) => {
        const dateDisplay = formatDate(activity.due_date);
        return (
          <div key={activity.id} className="flex items-center justify-between py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {typeLabels[activity.type] || activity.type}
                {activity.deal && ` · ${activity.deal.title}`}
              </p>
            </div>
            <span className={`text-xs font-medium ${dateDisplay.color} whitespace-nowrap ml-4`}>
              {dateDisplay.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
