
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CooperativaForm } from "@/components/configuracoes/CooperativaForm";
import { SystemSettingsForm } from "@/components/configuracoes/SystemSettingsForm";
import { ProfileSettingsForm } from "@/components/configuracoes/ProfileSettingsForm";
import { IntegracaoCoraForm } from "@/components/configuracoes/IntegracaoCoraForm";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500">
          Gerencie as configurações da cooperativa e do sistema
        </p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="cooperativa">Cooperativa</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <ProfileSettingsForm />
        </TabsContent>

        <TabsContent value="cooperativa" className="mt-4">
          <CooperativaForm />
        </TabsContent>

        <TabsContent value="sistema" className="mt-4">
          <SystemSettingsForm />
        </TabsContent>

        <TabsContent value="integracoes" className="mt-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Integração Cora</h2>
              <p className="text-gray-500">
                Configure a integração com o Cora para geração de boletos
              </p>
            </div>
            <IntegracaoCoraForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
