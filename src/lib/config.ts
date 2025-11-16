export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Nexo',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'nexo.com'
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,application/pdf').split(',')
  },
  rateLimit: {
    requests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000')
  }
}