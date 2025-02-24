
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/components/configuracoes/ProfileSettingsForm";
import { IntegracaoCoraForm } from "@/components/configuracoes/IntegracaoCoraForm";
import { SystemSettingsForm } from "@/components/configuracoes/SystemSettingsForm";
import { EmpresaForm } from "@/components/configuracoes/EmpresaForm";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações de perfil e sistema
        </p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettingsForm />
        </TabsContent>
        <TabsContent value="empresa">
          <EmpresaForm />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettingsForm />
        </TabsContent>
        <TabsContent value="integracao">
          <IntegracaoCoraForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
