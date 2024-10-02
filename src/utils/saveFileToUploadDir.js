import * as fs from 'node:fs/promises';
import * as path from 'path';

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';

const saveFileToUploadDir = async (file) => {
  const oldPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const newPath = path.join(UPLOAD_DIR, file.filename);
  // console.log(oldPath);
  // console.log(newPath);

  await fs.rename(oldPath, newPath);
  console.log(`Файл переміщено з ${oldPath} до ${newPath}`);
  return file.filename;
};

export default saveFileToUploadDir;

// // Функція для збереження файлу в папку temp
// const saveFileToUploadDir = async (file) => {
//   const tempFolder = 'temp'; // Папка для тимчасового збереження
//   const uploadsFolder = 'uploads'; // Папка для остаточного збереження

//   // Створіть папки, якщо вони не існують
//   await fs.mkdir(tempFolder, { recursive: true });
//   await fs.mkdir(uploadsFolder, { recursive: true });

//   // Визначте шлях до файлу
//   const tempFilePath = path.join(tempFolder, path.basename(file.path));

//   // Копіюйте файл в папку temp
//   await fs.copyFile(file.path, tempFilePath);

//   // Тепер перемістіть файл в uploads
//   const uploadFilePath = await moveFileToUploads(tempFilePath, uploadsFolder);

//   return uploadFilePath; // Повертає шлях до файлу в uploads
// };

// // Функція для переміщення файлу з temp в uploads
// const moveFileToUploads = async (tempFilePath, uploadsFolder) => {
//   const uploadFilePath = path.join(uploadsFolder, path.basename(tempFilePath));

//   try {
//     // Перемістіть файл з temp в uploads
//     await fs.rename(tempFilePath, uploadFilePath);
//     console.log(`Файл ${path.basename(tempFilePath)} переміщено в uploads.`);
//     return uploadFilePath; // Повертає новий шлях до файлу
//   } catch (error) {
//     console.error('Помилка під час переміщення файлу:', error);
//   }
// };

// // Використання функції
// const file = {
//   path: 'C:/Users/hp/Documents/GitHub/nodejs-hw-mongodb/ваш_файл.jpg',
// }; // Змініть на реальний шлях до файлу
// // Задайте шлях до вашого файлу
// saveFileToUploadDir(file)
//   .then((uploadedFilePath) => {
//     console.log('Файл успішно завантажено:', uploadedFilePath);
//   })
//   .catch((error) => {
//     console.error('Помилка:', error);
//   });

// export default saveFileToUploadDir;
