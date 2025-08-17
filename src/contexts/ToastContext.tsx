"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [currentToast, setCurrentToast] = useState<{
    id: string;
    message: string;
    type: ToastType;
    duration: number;
  } | null>(null);

  const showToast = (message: string, type: ToastType, duration: number = 5000) => {
    // Önceki uyarıyı kaldır
    setCurrentToast(null);
    
    // Kısa bir gecikme ile yeni uyarıyı göster
    setTimeout(() => {
      const id = Math.random().toString(36).substr(2, 9);
      setCurrentToast({ id, message, type, duration });
    }, 100);
  };

  const removeToast = () => {
    setCurrentToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {currentToast && (
        <Toast
          key={currentToast.id}
          message={currentToast.message}
          type={currentToast.type}
          duration={currentToast.duration}
          onClose={removeToast}
        />
      )}
    </ToastContext.Provider>
  );
}

