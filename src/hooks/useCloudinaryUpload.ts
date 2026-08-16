import { useState, useCallback } from 'react'
import { uploadImageToCloudinary, type UploadTarget } from '../services/cloudinaryService'

export function useCloudinaryUpload(target: UploadTarget = 'general') {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true)
      setError(null)
      try {
        const url = await uploadImageToCloudinary(file, target)
        return url
      } catch (e: any) {
        const message = e?.response?.data?.error?.message || e?.message || 'Error al subir la imagen'
        setError(message)
        throw e
      } finally {
        setUploading(false)
      }
    },
    [target],
  )

  return { upload, uploading, error, setError }
}
