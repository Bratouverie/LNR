// Responsive image URL helper — generates different sizes for Unsplash images
// For non-Unsplash URLs, returns as-is (already on CDN)

/**
 * @param {string} url - Original image URL
 * @param {'small'|'medium'|'large'} size - Desired size
 * @returns {string} - Optimized URL
 */
export function getImageUrl(url, size = 'medium') {
  if (!url) return url;
  const sizes = { small: 400, medium: 800, large: 1200 };
  const w = sizes[size] || 800;

  // Unsplash: modify w parameter
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    const params = new URLSearchParams(url.split('?')[1] || '');
    params.set('w', String(w));
    params.set('q', size === 'small' ? '60' : '70');
    params.set('auto', 'format');
    params.set('fit', 'crop');
    return `${base}?${params.toString()}`;
  }

  return url;
}

/**
 * Generates srcset string for responsive images
 * @param {string} url - Original image URL
 * @returns {string} - srcset attribute value
 */
export function getSrcSet(url) {
  if (!url || !url.includes('images.unsplash.com')) return undefined;
  const small = getImageUrl(url, 'small');
  const medium = getImageUrl(url, 'medium');
  const large = getImageUrl(url, 'large');
  return `${small} 400w, ${medium} 800w, ${large} 1200w`;
}