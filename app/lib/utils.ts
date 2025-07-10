import slugify from 'slugify'
import { nanoid } from 'nanoid'
import prisma from './prisma'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const generateUniqueSlug = async (
  modelName: keyof typeof prisma, 
  title: string
): Promise<string> => {
  const baseSlug = slugify(title, { lower: true, strict: true })
  let slug = baseSlug

  const model = prisma[modelName] as any

  while (await model.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${nanoid(4)}`
  }

  return slug
}

export const validateFile = (file: any) => {
    const MAX_FILE_SIZE = 1024 * 1024 * 5;
    const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file == undefined || !file) {
      return null
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        message: 'Max image size is 5MB.',
        status: 400,
      };
    }
  
    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
      return {
        message: 'Only .jpg, .jpeg, .png, and .webp formats are supported.',
        status: 400,
      };
    }
  
    return null
}

export const formatDate = (dateString: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  }

  const date = new Date(dateString)
  return date.toLocaleString('id-ID', options).replace('pukul', '').trim()
}


