
/**
 * Hook para detectar se o dispositivo é mobile
 * 
 * Este hook verifica se a largura da tela é compatível com
 * dispositivos móveis para permitir adaptação responsiva
 * dos componentes da aplicação.
 */
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Verificar quando o hook é inicializado
    checkSize();
    
    // Adicionar listener para mudanças de tamanho da tela
    window.addEventListener('resize', checkSize);
    
    // Limpar listener quando o componente é desmontado
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}
