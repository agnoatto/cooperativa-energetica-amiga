
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CooperativaInfo() {
  const { profile } = useAuth();

  const { data: cooperativa, isLoading } = useQuery({
    queryKey: ["cooperativa", profile?.cooperativa_id],
    enabled: !!profile?.cooperativa_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperativas")
        .select("*")
        .eq("id", profile?.cooperativa_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Carregando...</div>;
  if (!cooperativa) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Cooperativa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Nome</p>
            <p className="text-sm text-muted-foreground">{cooperativa.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Documento</p>
            <p className="text-sm text-muted-foreground">{cooperativa.documento}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{cooperativa.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Telefone</p>
            <p className="text-sm text-muted-foreground">{cooperativa.telefone || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Tipo</p>
            <p className="text-sm text-muted-foreground">{cooperativa.tipo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
