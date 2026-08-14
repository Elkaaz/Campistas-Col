/**
 * Subida de imágenes.
 *
 * Usa Cloudinary (upload sin firmar) cuando está configurado; si no,
 * devuelve la imagen como data URL para que el prototipo funcione sin backend.
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export const cloudinaryReady = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file: File): Promise<string> {
  if (!cloudinaryReady) return fileToDataUrl(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )

  if (!response.ok) throw new Error('No se pudo subir la imagen a Cloudinary')

  const data = (await response.json()) as { secure_url: string }
  return data.secure_url
}

export async function uploadImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadImage))
}
