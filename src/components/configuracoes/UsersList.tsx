
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
      // Primeiro, buscamos os perfis da cooperativa
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("cooperativa_id", profile?.cooperativa_id);

      if (profilesError) throw profilesError;

      // Depois, buscamos as roles de cada perfil
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .in("user_id", profilesData.map(p => p.id))
        .eq("cooperativa_id", profile?.cooperativa_id);

      if (rolesError) throw rolesError;

      // Combinamos os dados em um formato adequado
      const formattedUsers: UserWithRole[] = profilesData.map(profile => {
        const userRoles = rolesData
          .filter(r => r.user_id === profile.id)
          .map(r => ({ role: r.role as 'master' | 'user' }));

        return {
          id: profile.id,
          nome: profile.nome,
          email: profile.email,
          telefone: profile.telefone,
          cargo: profile.cargo,
          user_roles: userRoles.length > 0 ? userRoles : [{ role: 'user' }]
        };
      });

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
