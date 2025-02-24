
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

type UserWithRole = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cargo: string | null;
  user_roles: Array<{
    role: 'master' | 'user';
  }>;
};

export function UsersList() {
  const { profile } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", profile?.cooperativa_id],
    enabled: !!profile?.cooperativa_id && profile?.role === 'master',
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          nome,
          email,
          telefone,
          cargo,
          user_roles (
            role
          )
        `)
        .eq("cooperativa_id", profile?.cooperativa_id);

      if (error) throw error;

      // Transformar os dados para garantir o formato correto
      const formattedUsers: UserWithRole[] = data.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        cargo: user.cargo,
        user_roles: user.user_roles || [{ role: 'user' }]
      }));

      return formattedUsers;
    },
  });

  if (profile?.role !== 'master') return null;
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
