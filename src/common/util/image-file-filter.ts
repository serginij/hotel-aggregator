import { FileFilterCallback } from 'multer';

const imageMimes = ['image/png', 'image/jpeg'];

const maxSize = 1024 * 1024 * 5; // 5MB

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const isTypeAllowed = imageMimes.includes(file.mimetype);

  const isSizeAllowed = file.size <= maxSize;

  return cb(null, isTypeAllowed && isSizeAllowed);
};
