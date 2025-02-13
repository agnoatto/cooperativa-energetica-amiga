
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  Users,
  Wallet,
  User,
  Settings,
  DollarSign,
  LucideIcon,
} from "lucide-react";

type RouteSection = {
  label: string;
  routes: RouteItem[];
};

type RouteItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  subItems?: RouteItem[];
};

export const routes: RouteSection[] = [
  {
    label: "Visão Geral",
    routes: [
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
    ],
  },
  {
    label: "Gestão de Unidades",
    routes: [
      {
        label: "Cooperados",
        icon: Users,
        href: "/cooperados",
        color: "text-violet-500",
        subItems: [
          {
            label: "Unidades Beneficiárias",
            icon: Building2,
            href: "/cooperados/unidades",
            color: "text-violet-500",
          },
        ],
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
          {
            label: "Unidades de Usina",
            icon: Building2,
            href: "/unidades-usina",
            color: "text-pink-700",
          },
        ],
      },
    ],
  },
  {
    label: "Financeiro",
    routes: [
      {
        label: "Contas a Receber",
        icon: DollarSign,
        href: "/financeiro/contas-receber",
        color: "text-green-600",
      },
      {
        label: "Contas a Pagar",
        icon: Wallet,
        href: "/financeiro/contas-pagar",
        color: "text-red-600",
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
    ],
  },
  {
    label: "Sistema",
    routes: [
      {
        label: "Configurações",
        icon: Settings,
        href: "/configuracoes",
        color: "text-gray-500",
      },
    ],
  },
];
