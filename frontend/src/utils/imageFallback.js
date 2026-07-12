const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-label="Property image unavailable">
  <rect width="800" height="500" fill="#e2e8f0"/>
  <rect x="190" y="120" width="420" height="260" rx="28" fill="#f8fafc" stroke="#cbd5e1" stroke-width="10"/>
  <path d="M255 240 L400 160 L545 240" fill="none" stroke="#0f172a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="348" y="255" width="104" height="105" rx="10" fill="#94a3b8"/>
  <rect x="292" y="255" width="40" height="40" rx="6" fill="#cbd5e1"/>
  <rect x="468" y="255" width="40" height="40" rx="6" fill="#cbd5e1"/>
  <text x="400" y="410" text-anchor="middle" fill="#475569" font-family="Arial, sans-serif" font-size="28">
    Property image unavailable
  </text>
</svg>`;

export const PROPERTY_IMAGE_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

export const applyImageFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PROPERTY_IMAGE_FALLBACK;
};
