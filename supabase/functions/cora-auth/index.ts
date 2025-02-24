
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CoraConfiguracao {
  empresa_id: string;
  client_id: string;
  client_secret: string;
  ambiente: 'sandbox' | 'production';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Não autorizado: token não fornecido')
    }

    // Obter usuário autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('Erro ao obter usuário:', userError)
      throw new Error('Não autorizado: usuário não encontrado')
    }

    // Obter configurações do Cora para a empresa do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (!profile?.empresa_id) {
      throw new Error('Empresa não encontrada para o usuário')
    }

    const { data: config, error: configError } = await supabase
      .from('integracao_cora')
      .select('*')
      .eq('empresa_id', profile.empresa_id)
      .maybeSingle()

    if (configError) {
      console.error('Erro ao buscar configurações:', configError)
      throw new Error('Erro ao buscar configurações do Cora')
    }

    if (!config) {
      throw new Error('Configurações do Cora não encontradas')
    }

    // Determinar URL base baseado no ambiente
    const baseUrl = config.ambiente === 'sandbox' 
      ? 'https://sandbox.api.cora.com.br/token'
      : 'https://api.cora.com.br/token';

    // Tentar autenticar com o Cora
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.client_id,
        client_secret: config.client_secret,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Erro na resposta do Cora:', data)
      throw new Error(`Erro na autenticação com o Cora: ${data.error_description || 'Erro desconhecido'}`)
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Erro na função cora-auth:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
