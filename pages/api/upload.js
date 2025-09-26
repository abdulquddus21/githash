import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import FormData from 'form-data';

const execAsync = promisify(exec);

// Supabase sozlamalari
const SUPABASE_URL = 'https://xzbwfoacsnrmgjmildcr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Yndmb2Fjc25ybWdqbWlsZGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTkxNzUsImV4cCI6MjA3Mzc3NTE3NX0.c10rEbuzQIkVvuJEecEltokgaj6AqjyP5IoFVffjizc';

// Catbox.moe sozlamalari - fayl ichida saqlangan
const CATBOX_USER_HASH = 'f5b7fa9dcde44f181587045cf';
const CATBOX_API_URL = 'https://catbox.moe/user/api.php';
const CATBOX_MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB Catbox.moe cheklovi

// Video formatlarini aniqlash
const VIDEO_FORMATS = [
  'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 
  'video/webm', 'video/mkv', 'video/3gp', 'video/m4v', 'video/quicktime'
];

// Video kompressiya sozlamalari
const VIDEO_COMPRESSION_SETTINGS = {
  resolution: '720x480',
  videoBitrate: '800k',
  audioBitrate: '128k',
  fps: 30,
  codec: 'libx264',
  audioCodec: 'aac',
  preset: 'fast',
  crf: 28
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

    const fileStats = await fs.stat(inputPath);
    const originalSize = fileStats.size;

    // Agar fayl 200MB dan katta bo‘lsa, siqishni qattiqroq qilish
    const isLargeFile = originalSize > CATBOX_MAX_FILE_SIZE;
    const adjustedSettings = {
      ...VIDEO_COMPRESSION_SETTINGS,
      videoBitrate: isLargeFile ? '500k' : VIDEO_COMPRESSION_SETTINGS.videoBitrate,
      crf: isLargeFile ? 30 : VIDEO_COMPRESSION_SETTINGS.crf,
      resolution: isLargeFile ? '640x360' : VIDEO_COMPRESSION_SETTINGS.resolution
    };

    const ffmpegCommand = [
      'ffmpeg',
      '-i', `"${inputPath}"`,
      '-c:v', adjustedSettings.codec,
      '-c:a', adjustedSettings.audioCodec,
      '-b:v', adjustedSettings.videoBitrate,
      '-b:a', adjustedSettings.audioBitrate,
      '-r', adjustedSettings.fps,
      '-crf', adjustedSettings.crf,
      '-preset', adjustedSettings.preset,
      '-vf', `scale=${adjustedSettings.resolution}:force_original_aspect_ratio=decrease,pad=${adjustedSettings.resolution}:(ow-iw)/2:(oh-ih)/2`,
      '-movflags', '+faststart',
      '-y',
      `"${outputPath}"`
    ].join(' ');

    const startTime = Date.now();
    
    const { stdout, stderr } = await execAsync(ffmpegCommand, {
      timeout: 300000,
      maxBuffer: 1024 * 1024 * 10
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (existsSync(outputPath)) {
      const compressedStats = await fs.stat(outputPath);
      const compressedSize = compressedStats.size;
      
      if (compressedSize > CATBOX_MAX_FILE_SIZE) {
        throw new Error('Siqilgan video hali ham 200MB dan katta');
      }

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
  
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.3gp', '.m4v'];
  const extension = path.extname(filename).toLowerCase();
  return videoExtensions.includes(extension);
}

// Fayl nomini tozalash
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Faylni Catbox.moe ga yuklash
async function uploadFileToCatbox(filePath, fileName, mimeType) {
  try {
    if (!existsSync(filePath)) {
      throw new Error(`Fayl topilmadi: ${filePath}`);
    }

    console.log('📤 Uploading to Catbox:', fileName);
    
    const fileBuffer = await fs.readFile(filePath);
    const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);
    console.log('📁 File size:', fileSizeMB, 'MB');

    // Catbox.moe fayl hajmi cheklovi
    if (fileBuffer.length > CATBOX_MAX_FILE_SIZE) {
      throw new Error(`Fayl hajmi Catbox.moe uchun juda katta (${fileSizeMB}MB, max 200MB)`);
    }

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', CATBOX_USER_HASH);
    form.append('fileToUpload', fileBuffer, {
      filename: fileName,
      contentType: mimeType || 'application/octet-stream'
    });

    console.log('🔗 Uploading to Catbox API...');
    const uploadStartTime = Date.now();

    const response = await axios.post(CATBOX_API_URL, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 300000 // 5 minut
    });

    const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);

    if (response.status !== 200 || !response.data.startsWith('https://')) {
      throw new Error(`Upload muvaffaqiyatsiz: ${response.data}`);
    }

    const publicUrl = response.data.trim();

    console.log('✅ Upload successful:', publicUrl);
    console.log('⏱️ Upload time:', uploadDuration, 'seconds');
    console.log('📊 Upload speed:', ((fileBuffer.length / 1024 / 1024) / uploadDuration).toFixed(2), 'MB/s');
    
    return {
      fileName: fileName,
      publicUrl: publicUrl
    };

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    if (error.response) {
      console.error('Upload response status:', error.response.status);
      console.error('Upload response data:', error.response.data);
    }
    throw new Error(`Upload xatosi: ${error.message}`);
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
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: "Faqat POST so'rovlari qabul qilinadi",
      method: req.method 
    });
  }

  console.log('🚀 Starting upload process...');
  console.log('🌐 Request headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
    'user-agent': req.headers['user-agent']
  });

  // FFmpeg mavjudligini tekshirish
  const isFFmpegAvailable = await checkFFmpegAvailability();

  try {
    // Vaqtinchalik papka sozlash
    let tempDir;
    try {
      tempDir = os.tmpdir();
      console.log('📁 Using temp directory:', tempDir);
      
      if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true });
        console.log('📁 Created temp directory:', tempDir);
      }
    } catch (tempError) {
      console.error('❌ Temp directory error:', tempError.message);
      tempDir = path.join(process.cwd(), 'temp');
      if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true });
        console.log('📁 Created fallback temp directory:', tempDir);
      }
    }
    
    // Formidable sozlamalari - max 1GB per file
    const form = formidable({
      multiples: true,
      uploadDir: tempDir,
      keepExtensions: true,
      allowEmptyFiles: false,
      minFileSize: 1,
      maxFileSize: 1024 * 1024 * 1024, // 1GB
      maxFiles: Infinity,    
      maxTotalFileSize: Infinity,
      maxFieldsSize: Infinity,
      createDirsFromUploads: true,
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

    if (!files.file) {
      return res.status(400).json({ 
        error: 'Hech qanday fayl yuklanmadi',
        received: Object.keys(files)
      });
    }

    const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
    const totalSize = uploadedFiles.reduce((sum, file) => sum + (file.size || 0), 0);

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
    console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
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

        if (fileSize === 0) {
          throw new Error('Bo\'sh fayl');
        }

        if (!existsSync(tempFilePath)) {
          console.log('⏳ File not found, waiting 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!existsSync(tempFilePath)) {
            throw new Error(`Vaqtinchalik fayl topilmadi: ${tempFilePath}`);
          }
        }

        const fileStats = await fs.stat(tempFilePath);
        const actualFileSize = fileStats.size;
        
        console.log(`📊 File stats: reported=${fileSize}, actual=${actualFileSize}`);
        
        if (actualFileSize === 0) {
          throw new Error('Bo\'sh fayl');
        }

        // Video kompressiya
        let finalFilePath = tempFilePath;
        let finalFileSize = actualFileSize;
        let compressionInfo = null;

        if (isFFmpegAvailable && isVideoFile(mimeType, originalName)) {
          console.log('🎬 Video fayl aniqlandi, kompressiya boshlanmoqda...');
          
          const compressedName = `compressed_${Date.now()}_${path.basename(tempFilePath, path.extname(tempFilePath))}.mp4`;
          compressedFilePath = path.join(tempDir, compressedName);
          
          try {
            compressionInfo = await compressVideo(tempFilePath, compressedFilePath, mimeType);
            
            if (compressionInfo.success) {
              finalFilePath = compressedFilePath;
              finalFileSize = compressionInfo.compressedSize;
              console.log(`✅ Video kompressiya muvaffaqiyatli: ${compressionInfo.compressionRatio}% tejash`);
            } else if (compressionInfo.useOriginal && actualFileSize <= CATBOX_MAX_FILE_SIZE) {
              console.log('⚠️ Kompressiya ishlamadi, asl fayl ishlatiladi');
            } else {
              throw new Error('Video faylni siqish muvaffaqiyatsiz va hajmi 200MB dan katta');
            }
          } catch (compressionError) {
            console.error('❌ Video kompressiya xatosi:', compressionError.message);
            if (actualFileSize <= CATBOX_MAX_FILE_SIZE) {
              console.log('⚠️ Asl fayl ishlatiladi');
            } else {
              throw new Error('Video faylni siqish muvaffaqiyatsiz va hajmi 200MB dan katta');
            }
          }
        } else if (isVideoFile(mimeType, originalName) && !isFFmpegAvailable && actualFileSize > CATBOX_MAX_FILE_SIZE) {
          throw new Error('Video fayl 200MB dan katta va FFmpeg mavjud emas');
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
        const uploadResult = await uploadFileToCatbox(finalFilePath, fileName, compressionInfo?.success ? 'video/mp4' : mimeType);
        
        // Umumiy URL
        const publicUrl = uploadResult.publicUrl;

        results.push({
          success: true,
          url: publicUrl,
          filename: uploadResult.fileName,
          originalName: originalName,
          fileSize: finalFileSize,
          originalFileSize: actualFileSize,
          mimeType: compressionInfo?.success ? 'video/mp4' : mimeType,
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
        totalSize: totalSize < 1024 * 1024 
          ? `${(totalSize / 1024).toFixed(2)}KB`
          : `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
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
      timestamp: new Date().toISOString(),
      env_check: {
        hasUserHash: !!CATBOX_USER_HASH,
        nodeEnv: process.env.NODE_ENV
      }
    });
  }
}