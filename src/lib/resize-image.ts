// Redimensiona y comprime una imagen en el navegador ANTES de subirla.
// Convierte fotos pesadas de celular (3–6 MB) en archivos ligeros (~150–400 KB)
// sin que el usuario tenga que hacer nada. Reutilizable en cualquier proyecto.

export async function resizeImage(
  file: File,
  { maxW = 1600, maxH = 1600, quality = 0.82 }: { maxW?: number; maxH?: number; quality?: number } = {},
): Promise<File> {
  // Solo procesa imágenes; videos u otros archivos pasan tal cual.
  if (!file.type.startsWith('image/')) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' } as any);
  } catch {
    return file; // si algo falla, sube el original
  }

  const scale = Math.min(1, maxW / bitmap.width, maxH / bitmap.height);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  // webp pesa menos que jpeg con calidad equivalente
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality));
  if (!blob) return file;

  const nombre = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], nombre, { type: 'image/webp' });
}
