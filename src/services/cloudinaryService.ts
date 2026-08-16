import axios from 'axios'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export type UploadTarget = 'avatar' | 'post' | 'event' | 'cartilla' | 'general'

const FOLDER_BY_TARGET: Record<UploadTarget, string> = {
  avatar: 'campistas/avatars',
  post: 'campistas/posts',
  event: 'campistas/events',
  cartilla: 'campistas/cartillas',
  general: 'campistas/general',
}

/**
 * Sube una imagen a Cloudinary usando upload preset sin autenticación backend.
 * Necesita en .env.local:
 *   VITE_CLOUDINARY_CLOUD_NAME
 *   VITE_CLOUDINARY_UPLOAD_PRESET
 */
export async function uploadImageToCloudinary(
  file: File,
  target: UploadTarget = 'general'
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Faltan variables de entorno de Cloudinary')
  }

  const folder = FOLDER_BY_TARGET[target] || FOLDER_BY_TARGET.general

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.secure_url
}

export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split('/')
    const uploadIndex = parts.findIndex((part) => part === 'upload')
    if (uploadIndex === -1) return null
    const afterUpload = parts.slice(uploadIndex + 1)
    if (afterUpload[0].startsWith('v')) {
      afterUpload.shift()
    }
    const joined = afterUpload.join('/')
    const dotIndex = joined.lastIndexOf('.')
    if (dotIndex === -1) return null
    return joined.slice(0, dotIndex)
  } catch {
    return null
  }
}
