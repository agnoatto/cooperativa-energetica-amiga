
interface PersonalInfoProps {
  nome: string;
  documento: string;
  tipo_pessoa: string;
  telefone: string;
  email: string | null;
}

export function PersonalInfoSection({ 
  nome, 
  documento, 
  tipo_pessoa, 
  telefone, 
  email 
}: PersonalInfoProps) {
  const { formatarDocumento, formatarTelefone } = require('@/utils/formatters');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">Informações Pessoais</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground">Nome:</span>
            <p>{nome}</p>
          </div>
          <div>
            <span className="text-muted-foreground">CPF/CNPJ:</span>
            <p>{formatarDocumento(documento)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Tipo:</span>
            <p>{tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Contato</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground">Telefone:</span>
            <p>{formatarTelefone(telefone)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p>{email || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
