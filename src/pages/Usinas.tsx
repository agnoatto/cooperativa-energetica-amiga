
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { supabase } from "@/integrations/supabase/client";
import { UsinasHeader } from "./usinas/components/UsinasHeader";
import { UsinaMobileCard } from "./usinas/components/UsinaMobileCard";
import { UsinasDesktopTable } from "./usinas/components/UsinasDesktopTable";
import { useUsinas } from "./usinas/hooks/useUsinas";

const Usinas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();
  const isMobile = useIsMobile();
  const { data: usinas, refetch } = useUsinas();

  const handleDelete = async (usinaId: string) => {
    try {
      const { error } = await supabase
        .from('usinas')
        .delete()
        .eq('id', usinaId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error('Error deleting usina:', error);
    }
  };

  const handleEdit = (usinaId: string) => {
    setSelectedUsinaId(usinaId);
    setOpenForm(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleAddClick = () => {
    setSelectedUsinaId(undefined);
    setOpenForm(true);
  };

  if (isMobile) {
    return (
      <div className="space-y-6 p-4">
        <UsinasHeader onAddClick={handleAddClick} />

        <div className="space-y-4">
          {usinas?.map((usina) => (
            <UsinaMobileCard
              key={usina.id}
              usina={usina}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {(!usinas || usinas.length === 0) && (
            <div className="text-center py-8 px-4 border rounded-lg">
              <p className="text-gray-500">Nenhuma usina encontrada</p>
            </div>
          )}
        </div>

        <UsinaForm
          open={openForm}
          onOpenChange={setOpenForm}
          usinaId={selectedUsinaId}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsinasHeader onAddClick={handleAddClick} />
      
      <UsinasDesktopTable 
        usinas={usinas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UsinaForm
        open={openForm}
        onOpenChange={setOpenForm}
        usinaId={selectedUsinaId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default Usinas;
