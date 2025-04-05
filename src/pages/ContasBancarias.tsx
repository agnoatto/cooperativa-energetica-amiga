
/**
 * Página de Contas Bancárias
 * 
 * Esta página foi migrada para o módulo de Configurações para simplificar
 * o gerenciamento de contas bancárias e caixas.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function ContasBancarias() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirecionar para a página de configurações com a aba "contas" selecionada
  useEffect(() => {
    toast({
      title: "Funcionalidade atualizada!",
      description: "O gerenciamento de contas bancárias foi movido para a área de Configurações para simplificar o processo.",
    });
    navigate('/configuracoes?tab=contas');
  }, [navigate, toast]);
  
  return null;
}
