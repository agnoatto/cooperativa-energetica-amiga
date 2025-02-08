
import { useEffect, useRef, useState } from "react";
import { Canvas, TEvent, Rect, Textbox } from "fabric";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trash2, 
  Move, 
  Image as ImageIcon, 
  Type, 
  Table2, 
  UndoIcon, 
  RedoIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Download
} from "lucide-react";
import { toast } from "sonner";

export function PdfTemplateEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 595, // A4 width in pixels at 72 DPI
      height: 842, // A4 height in pixels at 72 DPI
      backgroundColor: '#ffffff',
    });

    fabricCanvas.on('object:modified', saveState);
    fabricCanvas.on('selection:created', handleSelectionCreated);
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));

    setCanvas(fabricCanvas);
    saveState();

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const saveState = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleSelectionCreated = (e: TEvent) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
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
        // Simples representação de tabela usando retângulo
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
        position = (canvas.width ?? 0) / 2 - (selectedObject.width ?? 0) / 2;
        break;
      case 'right':
        position = (canvas.width ?? 0) - (selectedObject.width ?? 0);
        break;
    }
    selectedObject.set('left', position);
    canvas.renderAll();
    saveState();
  };

  const saveTemplate = () => {
    if (!canvas) return;
    try {
      const templateData = canvas.toJSON();
      localStorage.setItem('pdfTemplate', JSON.stringify(templateData));
      toast.success("Template salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o template");
    }
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
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
                    value={Math.round(selectedObject.left)}
                    onChange={(e) => updateProperty('left', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Y</Label>
                  <Input 
                    type="number"
                    value={Math.round(selectedObject.top)}
                    onChange={(e) => updateProperty('top', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Largura</Label>
                  <Input 
                    type="number"
                    value={Math.round(selectedObject.width || 0)}
                    onChange={(e) => updateProperty('width', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Altura</Label>
                  <Input 
                    type="number"
                    value={Math.round(selectedObject.height || 0)}
                    onChange={(e) => updateProperty('height', Number(e.target.value))}
                  />
                </div>
              </div>
              {selectedObject.type === 'textbox' && (
                <div>
                  <Label>Texto</Label>
                  <Input 
                    value={selectedObject.text}
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
