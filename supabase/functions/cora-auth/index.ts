
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ENDPOINTS = {
  sandbox: {
    auth: 'https://auth.sandbox.corabank.com.br',
    api: 'https://api.sandbox.corabank.com.br',
  },
  production: {
    auth: 'https://auth.corabank.com.br',
    api: 'https://api.corabank.com.br',
  },
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extrair o ID da empresa do cabeçalho de autorização
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Buscar configurações do Cora para a empresa
    const { data: configs, error: configError } = await supabase
      .from('integracao_cora')
      .select('*')
      .single()

    if (configError || !configs) {
      console.error('Error fetching Cora config:', configError)
      throw new Error('Configurações do Cora não encontradas')
    }

    // Determinar endpoint baseado no ambiente
    const endpoints = ENDPOINTS[configs.ambiente]

    // Montar payload para autenticação
    const authPayload = new URLSearchParams()
    authPayload.append('grant_type', 'client_credentials')
    authPayload.append('client_id', configs.client_id)
    authPayload.append('client_secret', configs.client_secret)

    // Fazer requisição de autenticação
    const response = await fetch(`${endpoints.auth}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authPayload,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cora auth error:', data)
      throw new Error(data.error_description || 'Erro na autenticação com o Cora')
    }

    // Retornar token e informações
    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        ambiente: configs.ambiente,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in cora-auth function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
