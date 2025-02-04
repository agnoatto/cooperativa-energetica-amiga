import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { UnidadeBeneficiariaForm } from "@/components/cooperados/UnidadeBeneficiariaForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Cooperados = () => {
  const [showCooperadoForm, setShowCooperadoForm] = useState(false);
  const [showUnidadeForm, setShowUnidadeForm] = useState(false);
  const [selectedCooperado, setSelectedCooperado] = useState<any>(null);
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Buscar cooperados
      const { data: cooperadosData, error: cooperadosError } = await supabase
        .from('cooperados')
        .select('*');

      if (cooperadosError) throw cooperadosError;
      setCooperados(cooperadosData);

      // Buscar unidades beneficiárias
      const { data: unidadesData, error: unidadesError } = await supabase
        .from('unidades_beneficiarias')
        .select('*');

      if (unidadesError) throw unidadesError;
      setUnidades(unidadesData);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (cooperado: any) => {
    setSelectedCooperado({
      nome: cooperado.nome,
      documento: cooperado.documento,
      telefone: cooperado.telefone,
      email: cooperado.email,
      tipo_pessoa: cooperado.tipo_pessoa,
      responsavel_nome: cooperado.responsavel_nome,
      responsavel_cpf: cooperado.responsavel_cpf,
      responsavel_telefone: cooperado.responsavel_telefone,
    });
    setShowCooperadoForm(true);
  };

  const handleDelete = async (cooperadoId: string) => {
    try {
      const { error } = await supabase
        .from('cooperados')
        .delete()
        .eq('id', cooperadoId);

      if (error) throw error;

      toast.success("Cooperado excluído com sucesso!");
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao excluir cooperado: " + error.message);
    }
  };

  const handleDeleteUnidade = async (unidadeId: string) => {
    try {
      const { error } = await supabase
        .from('unidades_beneficiarias')
        .delete()
        .eq('id', unidadeId);

      if (error) throw error;

      toast.success("Unidade beneficiária excluída com sucesso!");
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao excluir unidade beneficiária: " + error.message);
    }
  };

  const formatarDocumento = (doc: string) => {
    const numero = doc.replace(/\D/g, '');
    if (numero.length === 11) {
      return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Cooperados</h1>
        <Button onClick={() => setShowCooperadoForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cooperado
        </Button>
      </div>

      <CooperadoForm 
        open={showCooperadoForm} 
        onOpenChange={setShowCooperadoForm}
        initialData={selectedCooperado}
        onSuccess={fetchData}
      />

      {selectedCooperadoId && (
        <UnidadeBeneficiariaForm
          open={showUnidadeForm}
          onOpenChange={setShowUnidadeForm}
          cooperadoId={selectedCooperadoId}
          onSuccess={fetchData}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome/Razão Social</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cooperados.map((cooperado) => (
              <TableRow key={cooperado.id}>
                <TableCell>{cooperado.nome}</TableCell>
                <TableCell>{cooperado.documento ? formatarDocumento(cooperado.documento) : '-'}</TableCell>
                <TableCell>
                  {cooperado.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </TableCell>
                <TableCell>
                  {cooperado.telefone}<br/>
                  {cooperado.email}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{unidades.filter(u => u.cooperado_id === cooperado.id).length}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCooperadoId(cooperado.id);
                        setShowUnidadeForm(true);
                      }}
                      title="Adicionar Unidade Beneficiária"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(cooperado)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(cooperado.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8">Unidades Beneficiárias</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número UC</TableHead>
              <TableHead>Apelido</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Data Entrada</TableHead>
              <TableHead>Data Saída</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades.map((unidade) => (
              <TableRow key={unidade.id}>
                <TableCell>{unidade.numero_uc}</TableCell>
                <TableCell>{unidade.apelido}</TableCell>
                <TableCell>{unidade.endereco}</TableCell>
                <TableCell>{unidade.percentual_desconto}%</TableCell>
                <TableCell>{new Date(unidade.data_entrada).toLocaleDateString()}</TableCell>
                <TableCell>
                  {unidade.data_saida 
                    ? new Date(unidade.data_saida).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteUnidade(unidade.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Cooperados;
