import { Storage } from '@google-cloud/storage'
import { env } from '../helpers/utils'

const storage = new Storage({ keyFilename: env('GOOGLE_SERVICE_ACCOUNT_KEY') })
const bucket = env('GOOGLE_STORAGE_BUCKET_NAME')
const FILE_PATH = 'images/'

// Transform name to lowercase and prefix with random string
const formatImageName = (name: string) => {
    const randomString = Math.random().toString(36).substring(2, 10)
    return `${randomString}-${name.toLowerCase()}`
}

export const uploadImage = async (image: Express.Multer.File) => {
    try {
        const newName = formatImageName(image.originalname)
        const fileCloud = storage.bucket(bucket).file(newName)
        await fileCloud.save(image.buffer, {
            contentType: image.mimetype,
        })
        return `https://storage.googleapis.com/${bucket}/${newName}`
    } catch (err) {
        console.error(err)
        return null
    }
}
