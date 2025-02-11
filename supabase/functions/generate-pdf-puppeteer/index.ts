
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { boletimData } = await req.json()
    console.log('Received data for PDF generation:', boletimData)

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Generate HTML content (simplified version for testing)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-section { margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Boletim de Medição</h1>
            <p>Data: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="info-section">
            <h2>Informações da Usina</h2>
            <p>Nome: ${boletimData.usina.nome_investidor}</p>
            <p>UC: ${boletimData.usina.numero_uc}</p>
            <p>Valor kWh: R$ ${boletimData.usina.valor_kwh.toFixed(2)}</p>
          </div>
          <div class="info-section">
            <h2>Dados de Geração</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Mês/Ano</th>
                  <th>Geração (kWh)</th>
                  <th>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                ${boletimData.pagamentos.map(p => `
                  <tr>
                    <td>${p.mes}/${p.ano}</td>
                    <td>${p.geracao_kwh}</td>
                    <td>R$ ${p.valor_total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `

    // Set content and generate PDF
    await page.setContent(htmlContent)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })

    // Close browser
    await browser.close()

    // Return PDF
    return new Response(pdf, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="boletim-${boletimData.usina.numero_uc}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
