
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CooperativaForm } from "@/components/configuracoes/CooperativaForm";
import { SystemSettingsForm } from "@/components/configuracoes/SystemSettingsForm";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500">
          Gerencie as configurações da cooperativa e do sistema
        </p>
      </div>

      <Tabs defaultValue="cooperativa" className="w-full">
        <TabsList>
          <TabsTrigger value="cooperativa">Cooperativa</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="cooperativa" className="mt-4">
          <CooperativaForm />
        </TabsContent>

        <TabsContent value="sistema" className="mt-4">
          <SystemSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
