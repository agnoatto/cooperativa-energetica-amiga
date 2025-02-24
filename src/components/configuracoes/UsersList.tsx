
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function UsersList() {
  const { profile } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", profile?.cooperativa_id],
    enabled: !!profile?.cooperativa_id && profile?.role === 'master',
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from("profiles")
        .select(`
          id,
          nome,
          email,
          telefone,
          cargo,
          user_roles!profiles_id_fkey (
            role
          )
        `)
        .eq("cooperativa_id", profile?.cooperativa_id);

      if (error) throw error;
      return users;
    },
  });

  if (!profile?.role === 'master') return null;
  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Usuários Vinculados</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telefone || '-'}</TableCell>
              <TableCell>{user.cargo || '-'}</TableCell>
              <TableCell>
                <Badge variant={user.user_roles?.[0]?.role === 'master' ? 'default' : 'secondary'}>
                  {user.user_roles?.[0]?.role === 'master' ? 'Administrador' : 'Usuário'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
