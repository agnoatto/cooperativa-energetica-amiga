
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obter usuário autenticado
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader?.split(' ')[1] ?? ''
    );

    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil do usuário para obter empresa_id
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.empresa_id) {
      throw new Error('Empresa não encontrada');
    }

    // Buscar configurações do Cora
    const { data: config, error: configError } = await supabaseClient
      .from('integracao_cora')
      .select('*')
      .eq('empresa_id', profile.empresa_id)
      .single();

    if (configError || !config) {
      throw new Error('Configurações do Cora não encontradas');
    }

    const baseUrl = config.ambiente === 'production' 
      ? 'https://api.cora.com.br'
      : 'https://sandbox.api.cora.com.br';

    // Autenticar com o Cora
    const response = await fetch(`${baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.client_id,
        client_secret: config.client_secret,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na autenticação Cora:', error);
      throw new Error('Falha na autenticação com o Cora');
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Erro na função cora-auth:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
