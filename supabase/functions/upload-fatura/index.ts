
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const formData = await req.formData()
    const file = formData.get('file')
    const faturaId = formData.get('faturaId')

    if (!file || !faturaId) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded or missing faturaId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Only PDF files are allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = fileName.split('.').pop()
    const filePath = `${faturaId}/${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('faturas_concessionaria')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Update fatura record with file information
    const { error: updateError } = await supabase
      .from('faturas')
      .update({
        arquivo_concessionaria_path: filePath,
        arquivo_concessionaria_nome: fileName
      })
      .eq('id', faturaId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully',
        filePath,
        fileName 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload file', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
