import { useState } from 'react';
import { Settings, Puzzle, AlertCircle } from 'lucide-react';
import { useIntegrationConfigs, type IntegrationProvider, type ProviderConfig } from '@/hooks/useIntegrationConfigs';
import IntegrationCard from '@/components/settings/IntegrationCard';

const providers: IntegrationProvider[] = ['manychat', 'zenvia_voice', 'activecampaign'];

export default function SettingsPage() {
  const { configs, isLoading, error, isAdmin, getProviderConfig, upsertConfig } = useIntegrationConfigs();
  const [savingProvider, setSavingProvider] = useState<IntegrationProvider | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (provider: IntegrationProvider, config: ProviderConfig, isActive: boolean) => {
    setSavingProvider(provider);
    try {
      await upsertConfig.mutateAsync({ provider, config, is_active: isActive });
      setToast({ type: 'success', message: 'Configuração salva com sucesso!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Erro ao salvar configuração. Tente novamente.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSavingProvider(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" />Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie as integrações e configurações do seu CRM.</p>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Puzzle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Integrações</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Conecte seu CRM com WhatsApp (ManyChat), telefonia (Zenvia Voice) e automação de marketing (ActiveCampaign).</p>

        {!isAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">Você precisa ser <strong>administrador</strong> ou <strong>proprietário</strong> para configurar integrações.</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Erro ao carregar integrações. Tente recarregar a página.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <IntegrationCard key={provider} provider={provider} existingConfig={getProviderConfig(provider)} isAdmin={isAdmin} isSaving={savingProvider === provider} onSave={handleSave} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
