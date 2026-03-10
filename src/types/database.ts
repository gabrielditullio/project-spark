export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          settings: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          settings?: Record<string, unknown>;
        };
        Update: {
          name?: string;
          slug?: string;
          settings?: Record<string, unknown>;
        };
      };
      members: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      companies: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          cnpj: string | null;
          segment: string | null;
          website: string | null;
          custom_fields: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          cnpj?: string | null;
          segment?: string | null;
          website?: string | null;
          custom_fields?: Record<string, unknown>;
        };
        Update: {
          name?: string;
          cnpj?: string | null;
          segment?: string | null;
          website?: string | null;
          custom_fields?: Record<string, unknown>;
        };
      };
      contacts: {
        Row: {
          id: string;
          organization_id: string;
          company_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          tags: string[];
          custom_fields: Record<string, unknown>;
          engagement_score: number;
          assigned_to: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          tags?: string[];
          custom_fields?: Record<string, unknown>;
          engagement_score?: number;
          assigned_to?: string | null;
        };
        Update: {
          company_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          tags?: string[];
          custom_fields?: Record<string, unknown>;
          engagement_score?: number;
          assigned_to?: string | null;
          deleted_at?: string | null;
        };
      };
      pipelines: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          is_default?: boolean;
        };
        Update: {
          name?: string;
          is_default?: boolean;
        };
      };
      pipeline_stages: {
        Row: {
          id: string;
          pipeline_id: string;
          name: string;
          color: string;
          position: number;
          win_probability: number;
          sla_days: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pipeline_id: string;
          name: string;
          color?: string;
          position: number;
          win_probability?: number;
          sla_days?: number | null;
        };
        Update: {
          name?: string;
          color?: string;
          position?: number;
          win_probability?: number;
          sla_days?: number | null;
        };
      };
      deals: {
        Row: {
          id: string;
          organization_id: string;
          pipeline_id: string;
          stage_id: string | null;
          contact_id: string | null;
          company_id: string | null;
          assigned_to: string | null;
          title: string;
          value: number;
          currency: string;
          status: 'open' | 'won' | 'lost';
          expected_close_date: string | null;
          lost_reason: string | null;
          custom_fields: Record<string, unknown>;
          position: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          pipeline_id: string;
          stage_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          assigned_to?: string | null;
          title: string;
          value?: number;
          currency?: string;
          status?: 'open' | 'won' | 'lost';
          expected_close_date?: string | null;
          position?: number;
        };
        Update: {
          stage_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          assigned_to?: string | null;
          title?: string;
          value?: number;
          status?: 'open' | 'won' | 'lost';
          expected_close_date?: string | null;
          lost_reason?: string | null;
          position?: number;
          deleted_at?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          organization_id: string;
          deal_id: string | null;
          contact_id: string | null;
          assigned_to: string | null;
          type: 'task' | 'call' | 'email' | 'meeting' | 'note' | 'whatsapp';
          title: string;
          description: string | null;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          deal_id?: string | null;
          contact_id?: string | null;
          assigned_to?: string | null;
          type: 'task' | 'call' | 'email' | 'meeting' | 'note' | 'whatsapp';
          title: string;
          description?: string | null;
          due_date?: string | null;
        };
        Update: {
          type?: 'task' | 'call' | 'email' | 'meeting' | 'note' | 'whatsapp';
          title?: string;
          description?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          organization_id: string;
          contact_id: string;
          channel: 'internal' | 'whatsapp' | 'email' | 'webchat';
          status: 'open' | 'waiting_client' | 'waiting_internal' | 'resolved';
          assigned_to: string | null;
          subject: string | null;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          contact_id: string;
          channel?: 'internal' | 'whatsapp' | 'email' | 'webchat';
          status?: 'open' | 'waiting_client' | 'waiting_internal' | 'resolved';
          assigned_to?: string | null;
          subject?: string | null;
        };
        Update: {
          status?: 'open' | 'waiting_client' | 'waiting_internal' | 'resolved';
          assigned_to?: string | null;
          subject?: string | null;
          last_message_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_type: 'member' | 'contact' | 'system';
          sender_id: string | null;
          content: string;
          content_type: 'text' | 'image' | 'file' | 'audio' | 'template';
          metadata: Record<string, unknown>;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_type: 'member' | 'contact' | 'system';
          sender_id?: string | null;
          content: string;
          content_type?: 'text' | 'image' | 'file' | 'audio' | 'template';
          metadata?: Record<string, unknown>;
        };
        Update: {
          content?: string;
          read_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          recipient_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          recipient_id: string;
          type?: string;
          title: string;
          body?: string | null;
          link?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
      };
    };
  };
}

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Member = Database['public']['Tables']['members']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type Pipeline = Database['public']['Tables']['pipelines']['Row'];
export type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row'];
export type Deal = Database['public']['Tables']['deals']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
