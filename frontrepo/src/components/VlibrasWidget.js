"use client";

import { useEffect } from 'react';

export default function VlibrasWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.VLibras) return; // already loaded

    const container = document.createElement('div');
    container.setAttribute('vw', '');
    container.className = 'vlibras-plugin';
    container.innerHTML = '<div vw-access-button class="vw-access-button"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.appendChild(container);

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      try {
        if (window.VLibras && typeof window.VLibras.Widget === 'function') {
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }
      } catch (e) {
        console.error('VLibras init error', e);
      }
    };
    document.body.appendChild(script);

    return () => {
      try { if (container.parentNode) container.parentNode.removeChild(container); } catch (e) {}
      try { if (script.parentNode) script.parentNode.removeChild(script); } catch (e) {}
    };
  }, []);

  return null;
}
