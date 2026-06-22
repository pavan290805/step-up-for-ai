import { useEffect } from 'react';

export function useLegacyStyle(id, cssText) {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [id, cssText]);
}
