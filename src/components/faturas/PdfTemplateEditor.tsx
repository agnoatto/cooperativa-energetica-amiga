
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Move, Image, Type, Table2, UndoIcon, RedoIcon } from "lucide-react";

interface TemplateElement {
  id: string;
  type: 'rectangle' | 'text' | 'image' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
}

export function PdfTemplateEditor() {
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null);
  const [history, setHistory] = useState<TemplateElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addElement = (type: TemplateElement['type']) => {
    const newElement: TemplateElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 50,
      y: 50,
      width: 100,
      height: type === 'text' ? 30 : 100,
      content: type === 'text' ? 'Texto' : undefined
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
  };

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    addToHistory(newElements);
  };

  const addToHistory = (newElements: TemplateElement[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newElements];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
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
            <Button variant="outline" onClick={() => addElement('image')}>
              <Image className="w-4 h-4 mr-2" />
              Imagem
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
            disabled={historyIndex === 0}
          >
            <UndoIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={redo}
            disabled={historyIndex === history.length - 1}
          >
            <RedoIcon className="w-4 h-4" />
          </Button>
        </div>

        {selectedElement && (
          <div className="space-y-4">
            <h3 className="font-medium">Propriedades</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>X</Label>
                  <Input 
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Y</Label>
                  <Input 
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Largura</Label>
                  <Input 
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Altura</Label>
                  <Input 
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                  />
                </div>
              </div>
              {selectedElement.type === 'text' && (
                <div>
                  <Label>Conteúdo</Label>
                  <Input 
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                  />
                </div>
              )}
              <Button 
                variant="destructive" 
                onClick={() => deleteElement(selectedElement.id)}
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
            className="w-[595px] h-[842px] mx-auto bg-white border border-gray-200 relative"
            style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute border border-gray-300 cursor-move ${
                  selectedElement?.id === element.id ? 'border-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                }}
                onClick={() => setSelectedElement(element)}
              >
                {element.type === 'text' && (
                  <div className="w-full h-full flex items-center justify-center">
                    {element.content}
                  </div>
                )}
                {element.type === 'image' && (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                {element.type === 'table' && (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Table2 className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
