
import { useEffect, useRef, useState } from "react";
import { Canvas, TEvent, Rect, Textbox, Object as FabricObject } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, 
  Move, 
  Type, 
  Table2, 
  UndoIcon, 
  RedoIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { DynamicFieldsLibrary } from "./template/DynamicFieldsLibrary";
import { PdfField, PdfTemplate } from "@/types/pdf-template";
import { supabase } from "@/integrations/supabase/client";

export function PdfTemplateEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [template, setTemplate] = useState<PdfTemplate | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 595,
      height: 842,
      backgroundColor: '#ffffff',
    });

    fabricCanvas.on('object:modified', saveState);
    fabricCanvas.on('selection:created', handleSelectionCreated);
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));

    setCanvas(fabricCanvas);
    loadDefaultTemplate();
    saveState();

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const loadDefaultTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_templates')
        .select('*, pdf_template_fields(*)')
        .eq('is_default', true)
        .single();

      if (error) throw error;

      if (data) {
        const templateData: PdfTemplate = {
          id: data.id,
          name: data.name,
          description: data.description,
          template_data: data.template_data as Record<string, any>,
          is_default: data.is_default,
          fields: data.pdf_template_fields
        };
        setTemplate(templateData);
        templateData.fields?.forEach(field => addFieldToCanvas(field));
      }
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      toast.error("Erro ao carregar template padrão");
    }
  };

  const addFieldToCanvas = (field: PdfField) => {
    if (!canvas) return;

    const textbox = new Textbox(field.field_label, {
      left: field.x_position,
      top: field.y_position,
      width: field.width,
      height: field.height,
      fontSize: field.font_size,
      fontFamily: field.font_family,
    });

    // Add custom data to the object
    (textbox as any).data = {
      field_key: field.field_key,
      field_type: field.field_type
    };

    canvas.add(textbox);
    canvas.renderAll();
  };

  const saveState = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleSelectionCreated = (e: { selected: FabricObject[] }) => {
    if (!canvas || !e.selected) return;
    const obj = e.selected[0];
    setSelectedObject(obj);
  };

  const addElement = (type: string) => {
    if (!canvas) return;

    let object;
    switch (type) {
      case 'rectangle':
        object = new Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 50,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
        });
        break;
      case 'text':
        object = new Textbox('Texto Editável', {
          left: 100,
          top: 100,
          width: 200,
          fontSize: 16,
        });
        break;
      case 'table':
        object = new Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 100,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
        });
        break;
    }

    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);
      saveState();
    }
  };

  const undo = () => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
      });
    }
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    setSelectedObject(null);
    saveState();
  };

  const updateProperty = (property: string, value: any) => {
    if (!selectedObject) return;
    selectedObject.set(property, value);
    canvas?.renderAll();
    saveState();
  };

  const alignObject = (alignment: 'left' | 'center' | 'right') => {
    if (!canvas || !selectedObject) return;
    let position;
    switch (alignment) {
      case 'left':
        position = 0;
        break;
      case 'center':
        position = (canvas.width ?? 0) / 2 - ((selectedObject as any).width ?? 0) / 2;
        break;
      case 'right':
        position = (canvas.width ?? 0) - ((selectedObject as any).width ?? 0);
        break;
    }
    selectedObject.set('left', position);
    canvas.renderAll();
    saveState();
  };

  const saveTemplate = async () => {
    if (!canvas || !template) return;

    try {
      const templateData = canvas.toJSON();
      const fields = canvas.getObjects().map(obj => ({
        field_key: (obj as any).data?.field_key || '',
        field_type: (obj as any).data?.field_type || 'text',
        field_label: (obj as any).text || '',
        x_position: Math.round(obj.left || 0),
        y_position: Math.round(obj.top || 0),
        width: Math.round((obj as any).width || 0),
        height: Math.round((obj as any).height || 0),
        font_size: (obj as any).fontSize || 12,
        font_family: (obj as any).fontFamily || 'Arial'
      }));

      const { error } = await supabase
        .from('pdf_templates')
        .upsert({
          id: template.id,
          template_data: templateData,
          fields: fields,
          is_default: true,
          name: template.name || 'Template Padrão',
          description: template.description || 'Template padrão para faturas'
        });

      if (error) throw error;
      toast.success("Template salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast.error("Erro ao salvar o template");
    }
  };

  const handleFieldSelect = (fieldDefinition: any) => {
    if (!canvas) return;

    const field: PdfField = {
      field_key: fieldDefinition.key,
      field_type: fieldDefinition.type,
      field_label: fieldDefinition.label,
      x_position: 100,
      y_position: 100,
      width: 200,
      height: 30,
      font_size: 12,
      font_family: 'Arial'
    };

    addFieldToCanvas(field);
    saveState();
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
            <TabsTrigger value="fields" className="flex-1">Campos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Elementos</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => addElement('rectangle')}>
                    <Move className="w-4 h-4 mr-2" />
                    Box
                  </Button>
                  <Button variant="outline" onClick={() => addElement('text')}>
                    <Type className="w-4 h-4 mr-2" />
                    Texto
                  </Button>
                  <Button variant="outline" onClick={() => addElement('table')}>
                    <Table2 className="w-4 h-4 mr-2" />
                    Tabela
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <UndoIcon className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <RedoIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={saveTemplate}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>

              {selectedObject && (
                <div className="space-y-4">
                  <h3 className="font-medium">Propriedades</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>X</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedObject.left || 0)}
                          onChange={(e) => updateProperty('left', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Y</Label>
                        <Input 
                          type="number"
                          value={Math.round(selectedObject.top || 0)}
                          onChange={(e) => updateProperty('top', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Largura</Label>
                        <Input 
                          type="number"
                          value={Math.round((selectedObject as any).width || 0)}
                          onChange={(e) => updateProperty('width', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Altura</Label>
                        <Input 
                          type="number"
                          value={Math.round((selectedObject as any).height || 0)}
                          onChange={(e) => updateProperty('height', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    {(selectedObject as any).text !== undefined && (
                      <div>
                        <Label>Texto</Label>
                        <Input 
                          value={(selectedObject as any).text}
                          onChange={(e) => updateProperty('text', e.target.value)}
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => alignObject('left')}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => alignObject('center')}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => alignObject('right')}
                      >
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={deleteSelected}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="fields">
            <DynamicFieldsLibrary onFieldSelect={handleFieldSelect} />
          </TabsContent>
        </Tabs>
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[800px] w-full">
          <div 
            className="w-[595px] mx-auto bg-white border border-gray-200"
            style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}
          >
            <canvas ref={canvasRef} />
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
