import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Phone,
  Mail,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IntegrationConfig, IntegrationProvider, ProviderConfig } from '@/hooks/useIntegrationConfigs';

interface IntegrationCardProps {
  provider: IntegrationProvider;
  existingConfig?: IntegrationConfig;
  isAdmin: boolean;
  isSaving: boolean;
  onSave: (provider: IntegrationProvider, config: ProviderConfig, isActive: boolean) => void;
}

interface ProviderMeta {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  docUrl: string;
  fields: { key: string; label: string; placeholder: string; type?: string }[];
}

const providerMeta: Record<IntegrationProvider, ProviderMeta> = {
  manychat: {
    name: 'ManyChat (WhatsApp)',
    description: 'Receba e envie mensagens do WhatsApp via ManyChat. Mensagens aparecem no Inbox do CRM.',
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    docUrl: 'https://support.manychat.com/support/solutions/articles/36000198423-external-request',
    fields: [
      { key: 'api_key', label: 'API Key do ManyChat', placeholder: 'Cole a API Key do ManyChat aqui...' },
      { key: 'page_id', label: 'Page ID (opcional)', placeholder: 'ID da página conectada' },
    ],
  },
  zenvia_voice: {
    name: 'Zenvia Voice (Telefonia)',
    description: 'Faça e receba ligações diretamente do CRM. Click-to-call em qualquer número de contato.',
    icon: Phone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    docUrl: 'https://zenvia.github.io/zenvia-openapi-spec/',
    fields: [
      { key: 'api_token', label: 'Token da API Zenvia', placeholder: 'Cole o token de API aqui...' },
      { key: 'caller_id', label: 'Número de origem (Caller ID)', placeholder: '+5511999999999' },
    ],
  },
  activecampaign: {
    name: 'ActiveCampaign',
    description: 'Sincronize contatos bidirecionalmente e dispare automações do AC a partir de eventos do CRM.',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    docUrl: 'https://developers.activecampaign.com/reference/overview',
    fields: [
      { key: 'api_url', label: 'URL da API', placeholder: 'https://suaconta.api-us1.com' },
      { key: 'api_key', label: 'API Key', placeholder: 'Cole a API Key do ActiveCampaign aqui...' },
    ],
  },
};

export default function IntegrationCard({ provider, existingConfig, isAdmin, isSaving, onSave }: IntegrationCardProps) {
  const meta = providerMeta[provider];
  const Icon = meta.icon;
  const [expanded, setExpanded] = useState(false);
  const [isActive, setIsActive] = useState(existingConfig?.is_active ?? false);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const config = (existingConfig?.config ?? {}) as Record<string, string>;
    const initial: Record<string, string> = {};
    meta.fields.forEach((f) => { initial[f.key] = config[f.key] ?? ''; });
    return initial;
  });

  const hasConfig = existingConfig !== undefined;
  const isConnected = hasConfig && existingConfig.is_active;

  const handleSave = () => { onSave(provider, formValues as ProviderConfig, isActive); };
  const handleFieldChange = (key: string, value: string) => { setFormValues((prev) => ({ ...prev, [key]: value })); };

  const supabaseUrl = 'https://oviycfskyptjnseiztux.supabase.co';
  const webhookMap: Record<IntegrationProvider, string> = {
    manychat: `${supabaseUrl}/functions/v1/manychat-webhook`,
    zenvia_voice: `${supabaseUrl}/functions/v1/voip-webhook`,
    activecampaign: `${supabaseUrl}/functions/v1/ac-webhook`,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', meta.bgColor)}>
            <Icon className={cn('w-6 h-6', meta.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{meta.name}</h3>
              {isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Ativo</Badge>
              ) : hasConfig ? (
                <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Inativo</Badge>
              ) : (
                <Badge variant="outline">Não configurado</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{meta.description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {!isAdmin ? (
            <div className="text-center py-4 text-gray-500"><p className="text-sm">Apenas administradores podem configurar integrações.</p></div>
          ) : (
            <>
              {meta.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={`${provider}-${field.key}`}>{field.label}</Label>
                  <Input id={`${provider}-${field.key}`} type={field.type ?? 'text'} placeholder={field.placeholder} value={formValues[field.key] ?? ''} onChange={(e) => handleFieldChange(field.key, e.target.value)} />
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor={`${provider}-active`}>Integração ativa</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Quando ativa, o CRM sincroniza dados com este serviço.</p>
                </div>
                <button id={`${provider}-active`} role="switch" aria-checked={isActive} onClick={() => setIsActive(!isActive)} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', isActive ? 'bg-indigo-600' : 'bg-gray-200')}>
                  <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', isActive ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <a href={meta.docUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">Ver documentação<ExternalLink className="w-3.5 h-3.5" /></a>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>) : (<><Save className="w-4 h-4 mr-2" />Salvar</>)}
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                <p className="text-xs font-medium text-gray-600 mb-1">URL do Webhook (para configurar no provedor):</p>
                <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded block break-all">{webhookMap[provider]}</code>
                <p className="text-xs text-gray-500 mt-1.5">Cole esta URL no painel do {meta.name.split(' (')[0]} para receber eventos.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
