const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único com timestamp e preservar a extensão original de forma segura.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname || '');
    const baseName = path.basename(file.originalname || '', ext) || 'arquivo';
    const safeBaseName = baseName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);
    cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de arquivos permitidos
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/markdown',
    'application/json',
    'application/xml',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Extensões permitidas
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.md', '.json', '.xml', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();
  const isAllowedMime = allowedMimes.includes(mime) || mime.startsWith('text/') || mime === 'application/json' || mime === 'application/xml' || mime === 'application/octet-stream' || mime === '';
  const isAllowedExtension = allowedExtensions.includes(ext) || ext === '.json' || ext === '.md' || ext === '.xml';

  if (isAllowedMime && isAllowedExtension) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}. Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, TXT, MD, JSON, XML, JPG, PNG, GIF, WEBP`), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
});

module.exports = upload;
