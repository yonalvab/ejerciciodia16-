import express from 'express'
import { PORT } from './config.js'
import multer from 'multer'
import { pool } from './db.js'

const app = express()

// configurar el almacenamiento de archivos en el servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// configurar la carga de archivos
const uploadAll = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('solo se permiten imagenes'))
    }
  }
})

// configurar la carga de archivos
const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      guardarNombre(file.originalname)
      cb(null, true)
    } else {
      cb(new Error('solo se permite archivos PDF'))
    }
  }
})

const uploadJpg = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      guardarNombre(file.originalname)
      cb(null, true)
    } else {
      cb(new Error('solo se permiten imagenes jpg'))
    }
  }
})

async function guardarNombre (name) {
  try {
    const query = 'INSERT INTO files (nombre) VALUES (?)'
    await pool.query(query, [name])
  } catch (error) {
    // res.status(500).json({ message: 'Hello World' })
    console.log(error.message)
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

// funcion para manejar el error
const handleError = (err, req, res, next) => {
  console.log(err)
  res.status(400).json({ error: 'Tipo de archivo no permitido ' })
}

// ruta para subir archivos y manejar el error de cuando no es una imagen
app.post('/api/upload/image', uploadAll.single('imagen'), handleError, async (req, res) => {
  res.json({ message: 'archivo subido correctamente' })
})

// ruta para subir un archivo PDF y manejar el error de cuando no es una PDF
app.post('/api/upload/pdf', uploadPdf.single('pdf'), handleError, async (req, res) => {
  res.json({ message: 'archivo PDF subido correctamente' })
})

// ruta para subir archivos y manejar el error de cuando no es una imagen JPG
app.post('/api/upload/jpg', uploadJpg.single('jpg'), handleError, async (req, res) => {
  res.json({ message: 'archivo JPG subido correctamente' })
})

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
