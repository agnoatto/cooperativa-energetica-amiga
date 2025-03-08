
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CalculoFaturaTemplateForm } from "./CalculoFaturaTemplateForm";
import { TemplateTable } from "./templates/TemplateTable";
import { DeleteTemplateDialog } from "./templates/DeleteTemplateDialog";
import { CalculoFaturaTemplate } from "@/types/template";
import { 
  fetchTemplates, 
  deleteTemplate, 
  checkTemplateInUse 
} from "./services/templateService";

export function CalculoFaturaTemplates() {
  const [templates, setTemplates] = useState<CalculoFaturaTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CalculoFaturaTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<CalculoFaturaTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  const fetchAllTemplates = async () => {
    setIsLoading(true);
    try {
      const templatesData = await fetchTemplates();
      setTemplates(templatesData);
    } catch (error: any) {
      toast.error(`Erro ao carregar templates: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  const handleEditTemplate = (template: CalculoFaturaTemplate) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
    setActiveTab("editor");
  };

  const handleDeleteTemplate = (template: CalculoFaturaTemplate) => {
    setTemplateToDelete(template);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      // Verificar se o template está sendo usado por alguma unidade beneficiária
      const isInUse = await checkTemplateInUse(templateToDelete.id);

      if (isInUse) {
        toast.error("Não é possível excluir um template que está sendo usado por unidades beneficiárias.");
        return;
      }

      // Executar a exclusão
      const success = await deleteTemplate(templateToDelete.id);

      if (!success) {
        throw new Error("Falha ao excluir o template.");
      }

      toast.success("Template excluído com sucesso!");
      setTemplateToDelete(null);
      fetchAllTemplates();
    } catch (error: any) {
      toast.error(`Erro ao excluir template: ${error.message}`);
    }
  };

  const handleFormSuccess = () => {
    fetchAllTemplates();
    setIsFormOpen(false);
    setSelectedTemplate(null);
    setActiveTab("templates");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Templates de Cálculo de Fatura</h3>
        <Button 
          onClick={() => {
            setSelectedTemplate(null);
            setIsFormOpen(true);
            setActiveTab("editor");
          }}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          {isFormOpen && (
            <TabsTrigger value="editor">
              {selectedTemplate ? "Editar Template" : "Novo Template"}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <TemplateTable
            templates={templates}
            isLoading={isLoading}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
          />
        </TabsContent>

        <TabsContent value="editor">
          {isFormOpen && (
            <CalculoFaturaTemplateForm
              template={selectedTemplate}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedTemplate(null);
                setActiveTab("templates");
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      {templateToDelete && (
        <DeleteTemplateDialog
          template={templateToDelete}
          isOpen={!!templateToDelete}
          onClose={() => setTemplateToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
