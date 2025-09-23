import { IncomingForm } from 'formidable';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Supabase konfiguratsiyasi
const supabaseUrl = "https://xzbwfoacsnrmgjmildcr.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Yndmb2Fjc25ybWdqbWlsZGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE5OTE3NSwiZXhwIjoyMDczNzc1MTc1fQ.t0u8Uy7D7N3KWgNthFTijhCucN4VcFc39QAPAwDYXfo";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bucket nomi
const BUCKET_NAME = 'Uploads';

// Ruxsat berilgan fayl turlari
const ALLOWED_FILE_TYPES = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'],
  videos: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg'],
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  audio: ['.mp3', '.wav', '.aac', '.ogg', '.flac'],
  archives: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

// MIME type tekshiruvi
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'image/bmp', 'image/tiff',
  'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
  'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/mpeg',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/rtf',
  'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac',
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
  'application/x-tar', 'application/gzip',
];

// Xavfli fayl kengaytmalari
const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs', '.jar'];

// Maksimal fayllar soni
const MAX_FILES = 20;

// Fayl turini tekshirish
function isFileTypeAllowed(filename, mimetype) {
  const extension = path.extname(filename).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    console.log(`Xavfli fayl turi aniqlandi: ${filename}`);
    return false;
  }
  const allAllowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat();
  const isExtensionAllowed = allAllowedExtensions.includes(extension);
  const isMimeTypeAllowed = ALLOWED_MIME_TYPES.includes(mimetype);
  return isExtensionAllowed && isMimeTypeAllowed;
}

// Fayl nomini tozalash
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9\-_\.]/g, '_');
}

// Bucket mavjudligini tekshirish
async function ensureBucketExists() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Bucket ro‘yxatini olishda xato:', error.message);
      return false;
    }
    const bucketExists = buckets.some((bucket) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
      });
      if (createError) {
        console.error('Bucket yaratishda xato:', createError.message);
        return false;
      }
      console.log(`Bucket "${BUCKET_NAME}" yaratildi`);
    }
    return true;
  } catch (error) {
    console.error('Bucketni tekshirishda xato:', error.message);
    return false;
  }
}

// Faylni yuklash (buffer usuli)
async function uploadFile(filePath, destinationPath, mimetype) {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, fileBuffer, {
        contentType: mimetype,
        upsert: false,
      });
    if (error) {
      console.error(`Supabase yuklash xatosi (path: ${destinationPath}):`, error.message);
      throw error;
    }
    return { data, error };
  } catch (error) {
    console.error(`Faylni yuklashda xato (path: ${destinationPath}):`, error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so‘rovlari qabul qilinadi' });
  }

  try {
    // Bucket mavjudligini tekshirish
    const bucketReady = await ensureBucketExists();
    if (!bucketReady) {
      return res.status(500).json({ error: 'Storage bucket tayyorlanmadi' });
    }

    const form = new IncomingForm({
      maxFiles: MAX_FILES,
      allowEmptyFiles: false,
      minFileSize: 1,
      multiples: true,
      keepExtensions: true,
      encoding: 'utf-8',
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse xatosi:', err.message);
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: 'Hech qanday fayl yuklanmadi' });
    }

    let uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
    if (uploadedFiles.length > MAX_FILES) {
      uploadedFiles.forEach((file) => {
        try {
          if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (unlinkError) {
          console.error('Vaqtinchalik faylni o‘chirishda xato:', unlinkError.message);
        }
      });
      return res.status(400).json({ error: `Fayllar soni juda ko‘p (maksimum ${MAX_FILES} ta)` });
    }

    const results = [];
    const errors = [];

    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const postIndex = Array.isArray(fields.postIndex) ? fields.postIndex[0] : fields.postIndex;

    for (const file of uploadedFiles) {
      try {
        const originalName = file.originalFilename || 'unknown';
        const mimetype = file.mimetype || 'application/octet-stream';
        const fileSize = file.size;

        console.log(`Fayl: ${originalName}, Hajmi: ${(fileSize / 1024 / 1024).toFixed(2)}MB, Turi: ${type}`);

        // Fayl turini tekshirish
        if (!isFileTypeAllowed(originalName, mimetype)) {
          if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
          errors.push({ filename: originalName, error: 'Ushbu fayl turi ruxsat berilmagan' });
          continue;
        }

        // Fayl nomini tozalash
        const safeOriginalName = sanitizeFilename(originalName);
        const fileExtension = path.extname(safeOriginalName);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        let fileName;
        let folderPath;

        if (type === 'profile') {
          folderPath = 'profiles';
          fileName = `${username}_${timestamp}_${randomString}${fileExtension}`;
        } else {
          folderPath = 'posts';
          const postSuffix = postIndex !== undefined ? `_post${postIndex}` : '';
          fileName = `${username}${postSuffix}_${timestamp}_${randomString}${fileExtension}`;
        }

        const filePath = `${folderPath}/${fileName}`;

        // Faylni yuklash
        const { data: uploadData, error: uploadError } = await uploadFile(file.filepath, filePath, mimetype);

        if (uploadError) {
          console.error('Supabase yuklash xatosi:', originalName, uploadError.message);
          errors.push({ filename: originalName, error: `Faylni saqlashda xatolik: ${uploadError.message}` });
          continue;
        }

        // Public URL olish
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;

        results.push({
          success: true,
          url: publicUrl,
          filename: fileName,
          originalName: originalName,
          fileSize: fileSize,
          mimeType: mimetype,
          path: filePath,
          bucket: BUCKET_NAME,
          type: type,
        });

        console.log(`Fayl muvaffaqiyatli yuklandi: ${originalName} -> ${publicUrl}`);

        // Vaqtinchalik faylni o‘chirish
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      } catch (fileError) {
        console.error('Faylni qayta ishlashda xato:', file.originalFilename, fileError.message);
        errors.push({ filename: file.originalFilename || 'unknown', error: `Faylni qayta ishlashda xato: ${fileError.message}` });
        if (file.filepath && fs.existsSync(file.filepath)) {
          try {
            fs.unlinkSync(file.filepath);
          } catch (unlinkError) {
            console.error('Vaqtinchalik faylni o‘chirishda xato:', unlinkError.message);
          }
        }
      }
    }

    const response = {
      success: errors.length === 0,
      uploaded: results,
      errors: errors,
      summary: {
        totalFiles: uploadedFiles.length,
        successful: results.length,
        failed: errors.length,
      },
    };

    return res.status(errors.length > 0 ? 207 : 200).json(response);
  } catch (error) {
    console.error('Umumiy xato:', error.message);
    return res.status(500).json({ error: 'Ichki server xatoligi', details: error.message });
  }
}