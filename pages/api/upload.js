import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import B2 from 'backblaze-b2';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Supabase sozlamalari
const SUPABASE_URL = 'https://xzbwfoacsnrmgjmildcr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Yndmb2Fjc25ybWdqbWlsZGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTkxNzUsImV4cCI6MjA3Mzc3NTE3NX0.c10rEbuzQIkVvuJEecEltokgaj6AqjyP5IoFVffjizc';

// Backblaze sozlamalari
const BACKBLAZE_KEY_ID = process.env.BACKBLAZE_KEY_ID;
const BACKBLAZE_APP_KEY = process.env.BACKBLAZE_APP_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

// Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Backblaze client
let b2 = null;
let isB2Initialized = false;
let bucketId = null;
let downloadUrl = null;

// Video formatlarini aniqlash
const VIDEO_FORMATS = [
  'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 
  'video/webm', 'video/mkv', 'video/3gp', 'video/m4v', 'video/quicktime'
];

// Video kompressiya sozlamalari
const VIDEO_COMPRESSION_SETTINGS = {
  resolution: '720x480', // 420p ga yaqin
  videoBitrate: '800k',   // Video bitrate
  audioBitrate: '128k',   // Audio bitrate
  fps: 30,                // FPS
  codec: 'libx264',       // Video kodek
  audioCodec: 'aac',      // Audio kodek
  preset: 'fast',         // Encoding tezligi
  crf: 28                 // Quality (18-28 oralig'ida, katta raqam - kichik hajm)
};

// FFmpeg mavjudligini tekshirish
async function checkFFmpegAvailability() {
  try {
    const { stdout } = await execAsync('ffmpeg -version');
    if (stdout.includes('ffmpeg version')) {
      console.log('✅ FFmpeg mavjud');
      return true;
    }
  } catch (error) {
    console.log('❌ FFmpeg topilmadi, video kompressiya o\'chiriladi');
    return false;
  }
  return false;
}

// Video faylni siqish
async function compressVideo(inputPath, outputPath, mimeType) {
  try {
    console.log('🎬 Video kompressiya boshlanmoqda...');
    console.log('📥 Input:', inputPath);
    console.log('📤 Output:', outputPath);

    // FFmpeg buyrug'ini tuzish
    const ffmpegCommand = [
      'ffmpeg',
      '-i', `"${inputPath}"`,                                    // Input fayl
      '-c:v', VIDEO_COMPRESSION_SETTINGS.codec,                 // Video kodek
      '-c:a', VIDEO_COMPRESSION_SETTINGS.audioCodec,            // Audio kodek
      '-b:v', VIDEO_COMPRESSION_SETTINGS.videoBitrate,          // Video bitrate
      '-b:a', VIDEO_COMPRESSION_SETTINGS.audioBitrate,          // Audio bitrate
      '-r', VIDEO_COMPRESSION_SETTINGS.fps,                     // FPS
      '-crf', VIDEO_COMPRESSION_SETTINGS.crf,                   // Quality
      '-preset', VIDEO_COMPRESSION_SETTINGS.preset,             // Encoding preset
      '-vf', `scale=${VIDEO_COMPRESSION_SETTINGS.resolution}:force_original_aspect_ratio=decrease,pad=${VIDEO_COMPRESSION_SETTINGS.resolution}:(ow-iw)/2:(oh-ih)/2`, // Resolution va padding
      '-movflags', '+faststart',                                 // Web uchun optimizatsiya
      '-y',                                                      // Overwrite
      `"${outputPath}"`                                          // Output fayl
    ].join(' ');

    console.log('🔄 FFmpeg buyrug\'i:', ffmpegCommand.substring(0, 100) + '...');

    // Kompressiya vaqtini o'lchash
    const startTime = Date.now();
    
    const { stdout, stderr } = await execAsync(ffmpegCommand, {
      timeout: 300000, // 5 daqiqa timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Natijalarni tekshirish
    if (existsSync(outputPath)) {
      const originalStats = await fs.stat(inputPath);
      const compressedStats = await fs.stat(outputPath);
      
      const originalSize = originalStats.size;
      const compressedSize = compressedStats.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

      console.log('✅ Video kompressiya tugadi');
      console.log(`📊 Asl hajm: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`📊 Yangi hajm: ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`📊 Tejash: ${compressionRatio}%`);
      console.log(`⏱️ Vaqt: ${duration}s`);

      return {
        success: true,
        originalSize,
        compressedSize,
        compressionRatio: parseFloat(compressionRatio),
        duration: parseFloat(duration)
      };
    } else {
      throw new Error('Kompressiya natijasida fayl yaratilmadi');
    }

  } catch (error) {
    console.error('❌ Video kompressiya xatosi:', error.message);
    
    // Agar FFmpeg xatosi bo'lsa, asl faylni qaytarish
    if (error.message.includes('timeout') || error.message.includes('ffmpeg')) {
      console.log('⚠️ Kompressiya muvaffaqiyatsiz, asl fayl ishlatiladi');
      return {
        success: false,
        error: error.message,
        useOriginal: true
      };
    }
    
    throw error;
  }
}

// Video fayl ekanligini aniqlash
function isVideoFile(mimeType, filename) {
  if (mimeType && VIDEO_FORMATS.includes(mimeType.toLowerCase())) {
    return true;
  }
  
  // Fayl nomidan ham tekshirish
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.3gp', '.m4v'];
  const extension = path.extname(filename).toLowerCase();
  return videoExtensions.includes(extension);
}

// Backblaze ni ishga tushirish
async function initializeB2() {
  try {
    if (isB2Initialized && b2 && bucketId && downloadUrl) {
      console.log('✅ B2 already initialized');
      return true;
    }

    // Environment variables ni tekshirish
    if (!BACKBLAZE_KEY_ID || !BACKBLAZE_APP_KEY || !BUCKET_NAME) {
      throw new Error('Backblaze sozlamalari .env.local faylida to\'liq emas');
    }

    console.log('🔄 Initializing Backblaze B2...');
    console.log('Key ID:', BACKBLAZE_KEY_ID.substring(0, 10) + '...');
    console.log('Bucket:', BUCKET_NAME);

    // B2 client yaratish
    b2 = new B2({
      applicationKeyId: BACKBLAZE_KEY_ID,
      applicationKey: BACKBLAZE_APP_KEY,
    });

    // Autorizatsiya
    console.log('🔐 Authorizing with Backblaze...');
    const authResponse = await b2.authorize();

    if (!authResponse?.data) {
      throw new Error('Authorization javob bo\'sh');
    }

    downloadUrl = authResponse.data.downloadUrl;
    console.log('✅ Authorization successful');

    // Bucket topish
    console.log('🗂️ Finding bucket...');
    const bucketsResponse = await b2.listBuckets();
    
    if (!bucketsResponse?.data?.buckets) {
      throw new Error('Buckets ro\'yxati olinmadi');
    }

    const bucket = bucketsResponse.data.buckets.find(b => b.bucketName === BUCKET_NAME);
    
    if (!bucket) {
      throw new Error(`Bucket "${BUCKET_NAME}" topilmadi. Mavjud bucketlar: ${bucketsResponse.data.buckets.map(b => b.bucketName).join(', ')}`);
    }

    bucketId = bucket.bucketId;
    isB2Initialized = true;

    console.log('✅ Bucket topildi:', bucket.bucketName);
    console.log('✅ Bucket ID:', bucketId);
    console.log('✅ Download URL:', downloadUrl.substring(0, 30) + '...');

    return true;

  } catch (error) {
    console.error('❌ Backblaze initialization xatosi:');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);

    // Reset qilish
    b2 = null;
    isB2Initialized = false;
    bucketId = null;
    downloadUrl = null;

    if (error.response?.status === 401) {
      throw new Error('❌ Backblaze kalitlari noto\'g\'ri! Yangi Application Key yarating va ruxsatlarni tekshiring.');
    } else if (error.response?.status === 403) {
      throw new Error('❌ Ruxsat yo\'q! Application Key da Read/Write ruxsatlari bor-mi tekshiring.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('❌ Internet ulanishi muammosi');
    } else {
      throw new Error(`❌ Backblaze xatosi: ${error.message}`);
    }
  }
}

// Fayl nomini tozalash
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Faylni Backblaze ga yuklash
async function uploadFileToB2(filePath, fileName, mimeType) {
  try {
    if (!b2 || !bucketId) {
      throw new Error('B2 ishga tushirilmagan');
    }

    // Fayl mavjudligini tekshirish
    if (!existsSync(filePath)) {
      throw new Error(`Fayl topilmadi: ${filePath}`);
    }

    console.log('📤 Uploading:', fileName);
    
    // Fayl o'qish
    const fileBuffer = await fs.readFile(filePath);
    console.log('📁 File size:', (fileBuffer.length / 1024 / 1024).toFixed(2), 'MB');

    // Upload URL olish
    const uploadUrlResponse = await b2.getUploadUrl({ bucketId });
    
    if (!uploadUrlResponse?.data) {
      throw new Error('Upload URL olinmadi');
    }

    // Faylni yuklash
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: fileName,
      data: fileBuffer,
      contentType: mimeType || 'application/octet-stream',
    });

    if (!uploadResponse?.data) {
      throw new Error('Upload javob bo\'sh');
    }

    console.log('✅ Upload successful:', uploadResponse.data.fileName);
    return uploadResponse.data;

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    throw new Error(`Upload xatosi: ${error.message}`);
  }
}

// Umumiy URL yaratish
function createPublicUrl(fileName) {
  try {
    if (!downloadUrl || !BUCKET_NAME) {
      throw new Error('Download URL yoki bucket nomi yo\'q');
    }
    
    const encodedFileName = encodeURIComponent(fileName);
    const publicUrl = `${downloadUrl}/file/${BUCKET_NAME}/${encodedFileName}`;
    
    console.log('🔗 Public URL:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('❌ URL yaratish xatosi:', error.message);
    throw new Error(`URL yaratish xatosi: ${error.message}`);
  }
}

// Vaqtinchalik faylni o'chirish
async function cleanupTempFile(filePath) {
  try {
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log('🗑️ Temp file deleted:', filePath);
    }
  } catch (error) {
    console.warn('⚠️ Temp file deletion warning:', error.message);
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // Katta fayllar uchun javob cheklovini olib tashlash
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: "Faqat POST so'rovlari qabul qilinadi",
      method: req.method 
    });
  }

  // FFmpeg mavjudligini tekshirish
  const isFFmpegAvailable = await checkFFmpegAvailability();

  try {
    console.log('🚀 Starting upload process...');
    
    // Backblaze ni ishga tushirish
    await initializeB2();
    
    // Vaqtinchalik papka yaratish va tekshirish
    let tempDir;
    try {
      tempDir = os.tmpdir();
      console.log('📁 Using temp directory:', tempDir);
      
      // Temp papka mavjudligini tekshirish va yaratish
      if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true });
        console.log('📁 Created temp directory:', tempDir);
      }
    } catch (tempError) {
      console.error('❌ Temp directory error:', tempError.message);
      // Fallback - joriy papkada temp yaratish
      tempDir = path.join(process.cwd(), 'temp');
      if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true });
        console.log('📁 Created fallback temp directory:', tempDir);
      }
    }
    
    // Formidable sozlamalari - barcha hajm cheklovlarini olib tashlash
    const form = formidable({
      multiples: true,
      uploadDir: tempDir,
      keepExtensions: true,
      allowEmptyFiles: false,
      minFileSize: 1,
      // Barcha hajm cheklovlarini olib tashladik
      maxFileSize: Infinity, // Cheksiz fayl hajmi
      maxFiles: Infinity,    // Cheksiz fayl soni  
      maxTotalFileSize: Infinity, // Cheksiz jami hajm
      maxFieldsSize: Infinity,    // Cheksiz field hajmi
      createDirsFromUploads: true, // Papkani avtomatik yaratish
    });

    console.log('📋 Parsing form data...');
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('❌ Form parsing error:', err.message);
          reject(new Error(`Form parsing xatosi: ${err.message}`));
        } else {
          console.log('✅ Form parsed successfully');
          resolve({ fields, files });
        }
      });
    });

    console.log('📁 Files received:', Object.keys(files));
    console.log('📝 Fields received:', Object.keys(fields));

    // Fayl mavjudligini tekshirish
    if (!files.file) {
      return res.status(400).json({ 
        error: 'Hech qanday fayl yuklanmadi',
        received: Object.keys(files)
      });
    }

    const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
    
    // Jami hajmni hisoblash (faqat ma'lumot uchun, cheklash uchun emas)
    const totalSize = uploadedFiles.reduce((sum, file) => sum + (file.size || 0), 0);

    // Fields ni olish
    const type = Array.isArray(fields.type) ? fields.type[0] : (fields.type || 'post');
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const postIndex = Array.isArray(fields.postIndex) ? fields.postIndex[0] : fields.postIndex;

    if (!username) {
      return res.status(400).json({ 
        error: 'Username majburiy',
        fields: Object.keys(fields)
      });
    }

    console.log(`📊 Upload session: type=${type}, username=${username}, files=${uploadedFiles.length}`);
    console.log(`📊 Total size: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`🎬 Video compression: ${isFFmpegAvailable ? 'ENABLED' : 'DISABLED'}`);

    const results = [];
    const errors = [];

    // Har bir faylni yuklash
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      let tempFilePath = null;
      let compressedFilePath = null;
      
      try {
        const originalName = file.originalFilename || `file_${i + 1}`;
        const mimeType = file.mimetype || 'application/octet-stream';
        const fileSize = file.size || 0;
        tempFilePath = file.filepath;

        console.log(`📤 Processing ${i + 1}/${uploadedFiles.length}: ${originalName}`);
        console.log(`📊 Size: ${(fileSize / 1024 / 1024).toFixed(2)}MB, Type: ${mimeType}`);

        // Faqat bo'sh fayl tekshirish qoldik
        if (fileSize === 0) {
          throw new Error('Bo\'sh fayl');
        }

        // Fayl mavjudligini tekshirish
        if (!existsSync(tempFilePath)) {
          // Agar fayl yo'q bo'lsa, biroz kutib qayta tekshirish
          console.log('⏳ File not found, waiting 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!existsSync(tempFilePath)) {
            throw new Error(`Vaqtinchalik fayl topilmadi: ${tempFilePath}`);
          }
        }

        // Fayl hajmini olish va tekshirish
        const fileStats = await fs.stat(tempFilePath);
        const actualFileSize = fileStats.size;
        
        console.log(`📊 File stats: reported=${fileSize}, actual=${actualFileSize}`);
        
        if (actualFileSize === 0) {
          throw new Error('Bo\'sh fayl');
        }

        // Video fayl ekanligini aniqlash va siqish
        let finalFilePath = tempFilePath;
        let finalFileSize = actualFileSize;
        let compressionInfo = null;

        if (isFFmpegAvailable && isVideoFile(mimeType, originalName)) {
          console.log('🎬 Video fayl aniqlandi, kompressiya boshlanmoqda...');
          
          // Kompressiya uchun yangi fayl yo'li
          const compressedName = `compressed_${Date.now()}_${path.basename(tempFilePath, path.extname(tempFilePath))}.mp4`;
          compressedFilePath = path.join(tempDir, compressedName);
          
          try {
            compressionInfo = await compressVideo(tempFilePath, compressedFilePath, mimeType);
            
            if (compressionInfo.success) {
              finalFilePath = compressedFilePath;
              finalFileSize = compressionInfo.compressedSize;
              console.log(`✅ Video kompressiya muvaffaqiyatli: ${compressionInfo.compressionRatio}% tejash`);
            } else if (compressionInfo.useOriginal) {
              console.log('⚠️ Kompressiya ishlamadi, asl fayl ishlatiladi');
            }
          } catch (compressionError) {
            console.error('❌ Video kompressiya xatosi:', compressionError.message);
            console.log('⚠️ Asl fayl ishlatiladi');
          }
        }

        // Fayl nomini yaratish
        const safeOriginalName = sanitizeFilename(originalName);
        const fileExtension = compressionInfo?.success ? '.mp4' : path.extname(safeOriginalName) || '';
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);

        let fileName;
        if (type === 'profile') {
          fileName = `profiles/${username}_${timestamp}_${randomId}${fileExtension}`;
        } else {
          const postSuffix = postIndex ? `_post${postIndex}` : '';
          const fileSuffix = uploadedFiles.length > 1 ? `_${i + 1}` : '';
          fileName = `posts/${username}${postSuffix}${fileSuffix}_${timestamp}_${randomId}${fileExtension}`;
        }

        console.log(`🎯 Destination: ${fileName}`);

        // Faylni yuklash
        const uploadResult = await uploadFileToB2(finalFilePath, fileName, compressionInfo?.success ? 'video/mp4' : mimeType);
        
        // Umumiy URL yaratish
        const publicUrl = createPublicUrl(fileName);

        results.push({
          success: true,
          url: publicUrl,
          filename: uploadResult.fileName,
          originalName: originalName,
          fileSize: finalFileSize,
          originalFileSize: actualFileSize,
          mimeType: compressionInfo?.success ? 'video/mp4' : mimeType,
          bucket: BUCKET_NAME,
          type: type,
          fileIndex: i + 1,
          totalFiles: uploadedFiles.length,
          compressed: compressionInfo?.success || false,
          compressionRatio: compressionInfo?.compressionRatio || null,
          compressionDuration: compressionInfo?.duration || null,
        });

        console.log(`✅ Success ${i + 1}/${uploadedFiles.length}: ${originalName}`);

      } catch (fileError) {
        console.error(`❌ File error ${i + 1}/${uploadedFiles.length}:`, fileError.message);
        errors.push({ 
          filename: file.originalFilename || `file_${i + 1}`, 
          error: fileError.message,
          fileIndex: i + 1 
        });
      } finally {
        // Vaqtinchalik fayllarni o'chirish
        if (tempFilePath) {
          await cleanupTempFile(tempFilePath);
        }
        if (compressedFilePath && compressedFilePath !== tempFilePath) {
          await cleanupTempFile(compressedFilePath);
        }
      }
    }

    // Natija
    const response = {
      success: errors.length === 0,
      uploaded: results,
      errors: errors,
      summary: {
        totalFiles: uploadedFiles.length,
        successful: results.length,
        failed: errors.length,
        totalSize: totalSize < 1024 * 1024 * 1024 
          ? `${(totalSize / 1024 / 1024).toFixed(2)}MB`
          : `${(totalSize / 1024 / 1024 / 1024).toFixed(2)}GB`,
        videosCompressed: results.filter(r => r.compressed).length,
        ffmpegAvailable: isFFmpegAvailable,
      },
    };

    console.log('🎉 Upload complete:', response.summary);

    const statusCode = errors.length === 0 ? 200 : (results.length > 0 ? 207 : 400);
    return res.status(statusCode).json(response);

  } catch (error) {
    console.error('❌ Global error:', error.message);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Server xatoligi', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}