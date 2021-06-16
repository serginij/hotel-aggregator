import { FileFilterCallback, diskStorage } from 'multer';
import { IMAGE_FILE_DEST } from '../common.constants';
import { v4 as uuid } from 'uuid';

const imageMimes = ['image/png', 'image/jpeg'];

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const isTypeAllowed = imageMimes.includes(file.mimetype);

  return cb(null, isTypeAllowed);
};

export const imageFileStorage = diskStorage({
  destination(req, file, cb) {
    cb(null, IMAGE_FILE_DEST);
  },
  filename(req, file, cb) {
    cb(null, `${uuid()}.${file.originalname.split('.').pop()}`);
  },
});
