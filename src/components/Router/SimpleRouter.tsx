// components/Router/SimpleRouter.tsx - Simple client-side router

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NavigationContextType } from '../../types/router';

// Navigation Context
const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Simple History implementation
class SimpleHistory {
  private history: string[] = [];
  private currentIndex: number = -1;
  private listeners: Array<(path: string) => void> = [];

  constructor(initialPath: string = '/') {
    this.history = [initialPath];
    this.currentIndex = 0;
  }

  get currentPath(): string {
    return this.history[this.currentIndex] || '/';
  }

  get canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  get canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  push(path: string): void {
    // Remove any forward history if we're navigating to a new path
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(path);
    this.currentIndex++;
    this.notifyListeners(path);
    this.updateBrowserHistory(path);
  }

  back(): void {
    if (this.canGoBack) {
      this.currentIndex--;
      const path = this.currentPath;
      this.notifyListeners(path);
      this.updateBrowserHistory(path);
    }
  }

  forward(): void {
    if (this.canGoForward) {
      this.currentIndex++;
      const path = this.currentPath;
      this.notifyListeners(path);
      this.updateBrowserHistory(path);
    }
  }

  listen(listener: (path: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(path: string): void {
    this.listeners.forEach(listener => listener(path));
  }

  private updateBrowserHistory(path: string): void {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  }
}

// Create global history instance
const history = new SimpleHistory(
  typeof window !== 'undefined' ? window.location.pathname : '/'
);

// Navigation Provider Component
interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(history.currentPath);

  useEffect(() => {
    const unlisten = history.listen(setCurrentPath);
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      unlisten();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    if (path !== currentPath) {
      history.push(path);
    }
  }, [currentPath]);

  const goBack = useCallback(() => {
    history.back();
  }, []);

  const goForward = useCallback(() => {
    history.forward();
  }, []);

  const navigationValue: NavigationContextType = {
    currentPath,
    navigate,
    goBack,
    goForward,
    canGoBack: history.canGoBack,
    canGoForward: history.canGoForward
  };

  return (
    <NavigationContext.Provider value={navigationValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Route Component
interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

export const Route: React.FC<RouteProps> = ({ path, component: Component, exact = false }) => {
  const { currentPath } = useNavigation();
  
  const matches = exact 
    ? currentPath === path
    : currentPath.startsWith(path);
    
  return matches ? <Component /> : null;
};

// Router Component
interface RouterProps {
  children: React.ReactNode;
}

export const Router: React.FC<RouterProps> = ({ children }) => {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
};

// Link Component
interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, onClick, title }) => {
  const { navigate } = useNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };
  
  return (
    <a 
      href={to} 
      onClick={handleClick} 
      className={className}
      title={title}
    >
      {children}
    </a>
  );
};