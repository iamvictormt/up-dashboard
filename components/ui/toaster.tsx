'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
<ToastViewport
  className="fixed 
             top-4 left-1/2 -translate-x-1/2 
             sm:top-auto sm:bottom-4 sm:right-4 sm:left-auto sm:translate-x-0 
             flex flex-col 
             p-4 gap-2 
             w-[400px] max-w-full 
             z-50"
/>

    </ToastProvider>
  );
}
