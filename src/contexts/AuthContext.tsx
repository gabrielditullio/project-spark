import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Member, Organization } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  member: Member | null;
  organization: Organization | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    member: null,
    organization: null,
    isLoading: true,
  });

  async function loadMemberData(userId: string) {
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (memberError || !memberData) {
      return { member: null, organization: null };
    }

    const member = memberData as unknown as Member;

    const { data: orgData } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', member.organization_id)
      .single();

    return { member, organization: (orgData as unknown as Organization) ?? null };
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const { member, organization } = await loadMemberData(session.user.id);
          setState({ user: session.user, session, member, organization, isLoading: false });
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, session: null, member: null, organization: null, isLoading: false });
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            const { member, organization } = await loadMemberData(session.user.id);
            setState({ user: session.user, session, member, organization, isLoading: false });
          } else {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const messages: Record<string, string> = {
        'Invalid login credentials': 'Email ou senha incorretos.',
        'Email not confirmed': 'Confirme seu email antes de entrar.',
      };
      return { error: messages[error.message] || 'Erro ao fazer login. Tente novamente.' };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) {
      const messages: Record<string, string> = {
        'User already registered': 'Este email já está cadastrado.',
        'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
      };
      return { error: messages[error.message] || 'Erro ao criar conta. Tente novamente.' };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
