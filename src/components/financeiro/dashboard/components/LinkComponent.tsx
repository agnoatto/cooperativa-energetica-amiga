
/**
 * Componente Link navegável
 * 
 * Encapsula a navegação para outros componentes do dashboard,
 * mantendo estilos consistentes para áreas clicáveis.
 */
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LinkComponentProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkComponent({ 
  href, 
  children,
  className 
}: LinkComponentProps) {
  return (
    <Link 
      to={href}
      className={cn(
        "block hover:bg-gray-50 transition-colors rounded-md cursor-pointer",
        className
      )}
    >
      {children}
    </Link>
  );
}
