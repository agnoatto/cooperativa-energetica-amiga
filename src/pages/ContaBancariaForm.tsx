
/**
 * Página de Formulário de Conta Bancária
 * 
 * Esta página permite criar e editar contas bancárias,
 * com opções para definir tipo, saldo inicial, e outras configurações.
 */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContaBancaria } from "@/hooks/contas-bancos/useContaBancaria";
import { ContaBancaria, TipoContaBancaria, StatusContaBancaria } from "@/types/contas-bancos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ContaBancariaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contaExistente, isLoading, salvarContaBancaria } = useContaBancaria(id);
  
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoContaBancaria>("corrente");
  const [status, setStatus] = useState<StatusContaBancaria>("ativa");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [digito, setDigito] = useState("");
  const [dataSaldoInicial, setDataSaldoInicial] = useState<Date>(new Date());
  const [saldoInicial, setSaldoInicial] = useState<number>(0);
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("#3b82f6"); // Azul padrão
  
  // Preencher o formulário com dados existentes quando disponíveis
  useEffect(() => {
    if (contaExistente) {
      setNome(contaExistente.nome || "");
      setTipo(contaExistente.tipo || "corrente");
      setStatus(contaExistente.status || "ativa");
      setBanco(contaExistente.banco || "");
      setAgencia(contaExistente.agencia || "");
      setConta(contaExistente.conta || "");
      setDigito(contaExistente.digito || "");
      setDataSaldoInicial(contaExistente.data_saldo_inicial ? new Date(contaExistente.data_saldo_inicial) : new Date());
      setSaldoInicial(contaExistente.saldo_inicial || 0);
      setDescricao(contaExistente.descricao || "");
      setCor(contaExistente.cor || "#3b82f6");
    }
  }, [contaExistente]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!nome) {
      toast.error("Nome da conta é obrigatório!");
      return;
    }
    
    // Construir objeto com dados da conta
    const contaData: Partial<ContaBancaria> = {
      nome,
      tipo,
      status,
      banco,
      agencia,
      conta,
      digito,
      // Convertendo a data para o formato esperado pelo backend
      data_saldo_inicial: dataSaldoInicial.toISOString(),
      saldo_inicial: saldoInicial,
      descricao,
      cor
    };
    
    const sucesso = await salvarContaBancaria(contaData);
    
    if (sucesso) {
      navigate('/financeiro/contas-bancos');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/financeiro/contas-bancos')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          </h1>
        </div>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}</CardTitle>
          <CardDescription>
            Preencha os dados da conta bancária ou caixa para gerenciar seus recursos financeiros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Conta *</Label>
                <Input 
                  id="nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  placeholder="Ex: Conta Principal, Caixa Loja"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Conta *</Label>
                <RadioGroup 
                  value={tipo} 
                  onValueChange={(value) => setTipo(value as TipoContaBancaria)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corrente" id="corrente" />
                    <Label htmlFor="corrente">Corrente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poupanca" id="poupanca" />
                    <Label htmlFor="poupanca">Poupança</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investimento" id="investimento" />
                    <Label htmlFor="investimento">Investimento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="caixa" id="caixa" />
                    <Label htmlFor="caixa">Caixa</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Dados bancários (apenas para contas que não são do tipo caixa) */}
            {tipo !== 'caixa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Input 
                    id="banco" 
                    value={banco} 
                    onChange={(e) => setBanco(e.target.value)} 
                    placeholder="Nome do banco"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agencia">Agência</Label>
                  <Input 
                    id="agencia" 
                    value={agencia} 
                    onChange={(e) => setAgencia(e.target.value)} 
                    placeholder="Número da agência"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor="conta">Conta</Label>
                    <Input 
                      id="conta" 
                      value={conta} 
                      onChange={(e) => setConta(e.target.value)} 
                      placeholder="Número da conta"
                    />
                  </div>
                  
                  <div className="w-20 space-y-2">
                    <Label htmlFor="digito">Dígito</Label>
                    <Input 
                      id="digito" 
                      value={digito} 
                      onChange={(e) => setDigito(e.target.value)} 
                      placeholder="Dígito"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data_saldo_inicial">Data do Saldo Inicial *</Label>
                <DatePicker
                  value={dataSaldoInicial}
                  onChange={setDataSaldoInicial}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="saldo_inicial">Saldo Inicial *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input 
                    id="saldo_inicial" 
                    type="number" 
                    value={saldoInicial} 
                    onChange={(e) => setSaldoInicial(parseFloat(e.target.value) || 0)} 
                    placeholder="0,00"
                    className="pl-9"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={(value) => setStatus(value as StatusContaBancaria)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status da conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="inativa">Inativa</SelectItem>
                    <SelectItem value="bloqueada">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    id="cor" 
                    type="color" 
                    value={cor} 
                    onChange={(e) => setCor(e.target.value)} 
                    className="w-16 h-10 p-1"
                  />
                  <span className="text-sm text-gray-500">
                    Selecione uma cor para identificar a conta
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder="Informações adicionais sobre a conta"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/financeiro/contas-bancos')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
