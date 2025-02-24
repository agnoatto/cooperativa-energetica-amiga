
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BoletoPayload {
  valor: number;
  vencimento: string;
  descricao: string;
  cooperado: {
    nome: string;
    documento: string;
    email: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  };
}

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

    // Verificar método e payload
    if (req.method !== 'POST') {
      throw new Error('Método não permitido');
    }

    const payload: BoletoPayload = await req.json();

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
    const authResponse = await fetch(`${baseUrl}/token`, {
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

    if (!authResponse.ok) {
      const error = await authResponse.json();
      console.error('Erro na autenticação Cora:', error);
      throw new Error('Falha na autenticação com o Cora');
    }

    const { access_token } = await authResponse.json();

    // Preparar dados do boleto
    const configuracoesBoleto = typeof config.configuracoes_boleto === 'string' 
      ? JSON.parse(config.configuracoes_boleto)
      : config.configuracoes_boleto;

    const boletoData = {
      charge: {
        amount: payload.valor,
        due_date: payload.vencimento,
        description: payload.descricao,
        payment_methods: ["BOLETO"],
        fine: {
          amount: configuracoesBoleto.multa.valor || undefined,
          percentage: configuracoesBoleto.multa.percentual || undefined,
        },
        interest: {
          amount: configuracoesBoleto.juros.valor || undefined,
          percentage: configuracoesBoleto.juros.percentual || undefined,
        },
        discount: configuracoesBoleto.desconto.percentual > 0 ? {
          amount: configuracoesBoleto.desconto.valor || undefined,
          percentage: configuracoesBoleto.desconto.percentual || undefined,
          limit_date: configuracoesBoleto.desconto.data_limite || undefined,
        } : undefined,
        instructions: configuracoesBoleto.instrucoes || [],
      },
      customer: {
        name: payload.cooperado.nome,
        tax_id: payload.cooperado.documento.replace(/\D/g, ''),
        email: payload.cooperado.email,
        address: {
          street: payload.cooperado.endereco.logradouro,
          number: payload.cooperado.endereco.numero,
          complement: payload.cooperado.endereco.complemento,
          neighborhood: payload.cooperado.endereco.bairro,
          city: payload.cooperado.endereco.cidade,
          state: payload.cooperado.endereco.estado,
          zip_code: payload.cooperado.endereco.cep.replace(/\D/g, ''),
        },
      },
    };

    // Gerar boleto no Cora
    const boletoResponse = await fetch(`${baseUrl}/v2/charges`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boletoData),
    });

    if (!boletoResponse.ok) {
      const error = await boletoResponse.json();
      console.error('Erro ao gerar boleto:', error);
      throw new Error('Falha ao gerar boleto no Cora');
    }

    const boleto = await boletoResponse.json();

    return new Response(JSON.stringify(boleto), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Erro na função cora-boleto:', error);
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
