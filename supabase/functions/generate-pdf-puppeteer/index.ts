
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import { ptBR } from "https://deno.land/x/date_fns@v2.22.1/locale/pt-BR/index.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { boletimData } = await req.json()
    console.log('Received data for PDF generation:', boletimData)

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Definir um tamanho de página A4
    await page.setViewport({ width: 794, height: 1123 }); // A4 em pixels a 96 DPI

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
            }
            .header img {
              height: 50px;
            }
            .header-right {
              text-align: right;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 200px 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .info-box {
              background-color: #F0F7FF;
              padding: 8px 12px;
              border-radius: 4px;
              margin-bottom: 8px;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 4px;
            }
            .info-value {
              font-weight: 600;
              color: #333;
            }
            .charts {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .chart {
              height: 200px;
              border: 1px solid #eee;
              padding: 10px;
              border-radius: 4px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            .table th, .table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .table th {
              background-color: #F0F7FF;
              font-weight: 600;
            }
            .table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>Cooperativa Cogesol</h2>
              <p>CNPJ: 57.658.963/0001-02</p>
            </div>
            <div class="header-right">
              <p>Mês de Referência</p>
              <p>${format(new Date(), 'MMM/yy', { locale: ptBR })}</p>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <div class="info-box">
                <div class="info-label">Usina</div>
                <div class="info-value">${boletimData.usina.nome_investidor}</div>
              </div>
              <div class="info-box">
                <div class="info-label">UC</div>
                <div class="info-value">${boletimData.usina.numero_uc}</div>
              </div>
              <div class="info-box">
                <div class="info-label">Concessionária</div>
                <div class="info-value">${boletimData.usina.concessionaria}</div>
              </div>
              <div class="info-box">
                <div class="info-label">Modalidade</div>
                <div class="info-value">${boletimData.usina.modalidade}</div>
              </div>
              <div class="info-box">
                <div class="info-label">Valor da Tarifa</div>
                <div class="info-value">R$ ${boletimData.usina.valor_kwh.toFixed(2)}</div>
              </div>
              <div class="info-box">
                <div class="info-label">Valor a Receber</div>
                <div class="info-value">R$ ${boletimData.valor_receber.toFixed(2)}</div>
              </div>
            </div>

            <div>
              <div class="chart">
                <h3>Geração (kWh/mês)</h3>
                <!-- Chart will be replaced with canvas -->
              </div>
              <div class="chart">
                <h3>Recebimentos (R$)</h3>
                <!-- Chart will be replaced with canvas -->
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Mês de Produção</th>
                <th>Geração kWh</th>
                <th>Consumo kWh da Unidade</th>
                <th>Saldo kWh Injetado</th>
                <th>Total R$ Bruto</th>
                <th>Retenção R$ Fio B</th>
                <th>Fatura Concessionária</th>
                <th>Líquido em R$</th>
                <th>Fatura R$ Geradora</th>
                <th>Data de Vencto Gerador</th>
              </tr>
            </thead>
            <tbody>
              ${boletimData.pagamentos.map(p => `
                <tr>
                  <td>${format(new Date(p.ano, p.mes - 1), 'MMM/yy', { locale: ptBR })}</td>
                  <td>${p.geracao_kwh}</td>
                  <td>${p.consumo_kwh || 0}</td>
                  <td>${p.saldo_kwh || 0}</td>
                  <td>R$ ${p.valor_bruto?.toFixed(2) || '0.00'}</td>
                  <td>R$ ${p.valor_tusd_fio_b?.toFixed(2) || '0.00'}</td>
                  <td>R$ ${p.valor_concessionaria?.toFixed(2) || '0.00'}</td>
                  <td>R$ ${p.valor_liquido?.toFixed(2) || '0.00'}</td>
                  <td>R$ ${p.valor_total.toFixed(2)}</td>
                  <td>${p.data_vencimento ? format(new Date(p.data_vencimento), 'dd/MM/yyyy') : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    // Set content and generate PDF
    await page.setContent(htmlContent)
    
    // Add charts using Chart.js
    await page.addScriptTag({
      url: 'https://cdn.jsdelivr.net/npm/chart.js'
    })

    // Generate charts
    await page.evaluate((data) => {
      const charts = document.querySelectorAll('.chart')
      const chartData = data.pagamentos.slice(-12).map(p => ({
        month: new Date(p.ano, p.mes - 1),
        geracao: p.geracao_kwh,
        valor: p.valor_total
      }))

      // Sort by date
      chartData.sort((a, b) => a.month - b.month)

      // Geração Chart
      const geracaoCtx = document.createElement('canvas')
      charts[0].appendChild(geracaoCtx)
      new Chart(geracaoCtx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })),
          datasets: [{
            label: 'Geração (kWh)',
            data: chartData.map(d => d.geracao),
            backgroundColor: '#4F46E5',
            borderRadius: 4
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })

      // Recebimentos Chart
      const recebimentosCtx = document.createElement('canvas')
      charts[1].appendChild(recebimentosCtx)
      new Chart(recebimentosCtx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })),
          datasets: [{
            label: 'Valor (R$)',
            data: chartData.map(d => d.valor),
            backgroundColor: '#4F46E5',
            borderRadius: 4
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `R$ ${value.toFixed(2)}`
              }
            }
          }
        }
      })
    }, boletimData)

    // Wait for charts to render
    await page.waitForTimeout(1000)

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

    await browser.close()

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
