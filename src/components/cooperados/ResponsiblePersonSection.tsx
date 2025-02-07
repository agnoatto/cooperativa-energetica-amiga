
interface ResponsiblePersonProps {
  nome: string | null;
  cpf: string | null;
  telefone: string | null;
}

export function ResponsiblePersonSection({ 
  nome, 
  cpf, 
  telefone 
}: ResponsiblePersonProps) {
  const { formatarDocumento, formatarTelefone } = require('@/utils/formatters');

  return (
    <div>
      <h3 className="font-semibold mb-2">Dados do Responsável</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-muted-foreground">Nome:</span>
          <p>{nome || '-'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">CPF:</span>
          <p>{cpf ? formatarDocumento(cpf) : '-'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Telefone:</span>
          <p>{telefone ? formatarTelefone(telefone) : '-'}</p>
        </div>
      </div>
    </div>
  );
}
