import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type IntegrationProvider = 'manychat' | 'zenvia_voice' | 'activecampaign';
export type ProviderConfig = Record<string, string>;

export interface IntegrationConfig {
  id: string;
  organization_id: string;
  provider: IntegrationProvider;
  config: Record<string, unknown>;
  is_active: boolean;
  webhook_secret: string | null;
  created_at: string;
  updated_at: string;
}

export function useIntegrationConfigs() {
  const { member, organization } = useAuth();
  const queryClient = useQueryClient();

  const organizationId = organization?.id;
  const isAdmin = member?.role === 'owner' || member?.role === 'admin';

  const query = useQuery({
    queryKey: ['integration-configs', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_configs')
        .select('*')
        .eq('organization_id', organizationId!)
        .order('provider', { ascending: true });
      if (error) throw error;
      return data as IntegrationConfig[];
    },
    enabled: !!organizationId,
  });

  const upsertConfig = useMutation({
    mutationFn: async ({
      provider, config, is_active,
    }: {
      provider: IntegrationProvider;
      config: ProviderConfig;
      is_active: boolean;
    }) => {
      if (!organizationId) throw new Error('Organização não encontrada');
      const { data, error } = await supabase
        .from('integration_configs')
        .upsert(
          { organization_id: organizationId, provider, config, is_active },
          { onConflict: 'organization_id,provider' }
        )
        .select()
        .single();
      if (error) throw error;
      return data as IntegrationConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-configs', organizationId] });
    },
  });

  const getProviderConfig = (provider: IntegrationProvider): IntegrationConfig | undefined => {
    return query.data?.find((c) => c.provider === provider);
  };

  return {
    configs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    isAdmin,
    getProviderConfig,
    upsertConfig,
  };
}
