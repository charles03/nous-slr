// types/router.ts - Router type definitions

export type RouteParams = Record<string, string>;

export interface RouteDefinition {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  description?: string;
  requiresAuth?: boolean;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children?: NavigationItem[];
}

export type NavigationContextType = {
  currentPath: string;
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
};