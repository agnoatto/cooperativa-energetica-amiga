
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  Users,
  Wallet,
  User,
} from "lucide-react";

export const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Cooperados",
    icon: Users,
    href: "/cooperados",
    color: "text-violet-500",
  },
  {
    label: "Usinas",
    icon: Building2,
    href: "/usinas",
    color: "text-pink-700",
    subItems: [
      {
        label: "Investidores",
        icon: User,
        href: "/usinas/investidores",
        color: "text-pink-700",
      },
    ],
  },
  {
    label: "Unidades de Usina",
    icon: Building2,
    href: "/unidades-usina",
    color: "text-orange-700",
  },
  {
    label: "Faturas",
    icon: FileText,
    href: "/faturas",
    color: "text-violet-500",
  },
  {
    label: "Pagamentos",
    icon: Wallet,
    href: "/pagamentos",
    color: "text-green-500",
  },
] as const;
