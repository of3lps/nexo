import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'
import { config } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!config.upload.allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Validar tamanho
    if (file.size > config.upload.maxFileSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitizar nome do arquivo e gerar nome único
    const timestamp = Date.now()
    const ext = extname(file.name)
    const safeName = basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '')
    const fileName = `${timestamp}-${safeName}${ext}`
    
    // Garantir que o diretório existe
    const uploadDir = join(process.cwd(), 'public/uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    const path = join(uploadDir, fileName)

    await writeFile(path, buffer)

    return NextResponse.json({ 
      url: `/uploads/${fileName}`,
      name: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}