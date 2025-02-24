
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Inicializar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido')
    }

    // Obter usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('Erro ao obter usuário:', userError)
      throw new Error('Usuário não encontrado ou não autenticado')
    }

    // Obter empresa_id do perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.empresa_id) {
      console.error('Erro ao buscar perfil:', profileError)
      throw new Error('Empresa não encontrada para o usuário')
    }

    // Buscar configurações do Cora
    const { data: config, error: configError } = await supabase
      .from('integracao_cora')
      .select('*')
      .eq('empresa_id', profile.empresa_id)
      .single()

    if (configError || !config) {
      console.error('Erro ao buscar configurações:', configError)
      throw new Error('Configurações do Cora não encontradas')
    }

    // Determinar URL base do Cora
    const baseUrl = config.ambiente === 'production'
      ? 'https://api.cora.com.br/api/v1/token'
      : 'https://sandbox.api.cora.com.br/api/v1/token';

    // Fazer requisição para o Cora
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

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Erro na resposta do Cora:', responseData)
      throw new Error(responseData.error_description || 'Erro na autenticação com o Cora')
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
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
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno no servidor'
      }),
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
