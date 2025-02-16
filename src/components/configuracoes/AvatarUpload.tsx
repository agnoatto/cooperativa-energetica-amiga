
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  nome?: string | null;
}

export function AvatarUpload({ avatarUrl, nome }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          avatar_storage_path: filePath,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>
            {nome?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
          <label 
            htmlFor="avatar-upload"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
          >
            {isUploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "+"
            )}
          </label>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">Foto de Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Clique no botão + para alterar sua foto
        </p>
      </div>
    </div>
  );
}
