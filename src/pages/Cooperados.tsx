import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, FileDown } from "lucide-react";
import { useState } from "react";
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

const Cooperados = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCooperado, setSelectedCooperado] = useState<any>(null);

  const handleEdit = (cooperado: any) => {
    setSelectedCooperado(cooperado);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCooperado(null);
  };

  const generatePDF = (cooperado: any) => {
    const doc = new jsPDF();
    
    // Configuração da fonte para suportar caracteres especiais
    doc.setFont("helvetica");
    
    // Título
    doc.setFontSize(20);
    doc.text("Dados do Cooperado", 105, 20, { align: "center" });
    
    // Informações do cooperado
    doc.setFontSize(12);
    doc.text(`Nome: ${cooperado.nome}`, 20, 40);
    doc.text(`CPF/CNPJ: ${cooperado.documento}`, 20, 50);
    doc.text(`Telefone: ${cooperado.telefone}`, 20, 60);
    doc.text(`Email: ${cooperado.email}`, 20, 70);
    
    // Salvar o PDF
    doc.save(`cooperado-${cooperado.nome}.pdf`);
    toast.success("PDF gerado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Cooperados</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cooperado
        </Button>
      </div>

      <CooperadoForm 
        open={showForm} 
        onOpenChange={handleCloseForm}
        initialData={selectedCooperado}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>João Silva</TableCell>
              <TableCell>123.456.789-00</TableCell>
              <TableCell>(11) 99999-9999</TableCell>
              <TableCell>2</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleEdit({
                    nome: "João Silva",
                    documento: "12345678900",
                    telefone: "11999999999",
                    email: "joao@example.com"
                  })}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => generatePDF({
                    nome: "João Silva",
                    documento: "123.456.789-00",
                    telefone: "(11) 99999-9999",
                    email: "joao@example.com"
                  })}
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Cooperados;