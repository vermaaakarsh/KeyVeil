import { CATEGORY_ENUM } from '@/lib/enums';
import { TEncryptedDataObject } from '@/services/cryptography/ICryptography';

export type TPassword = {
  _id: string;
  userId: string;
  name: string;
  username: string;
  url: string;
  password: TEncryptedDataObject;
  category: CATEGORY_ENUM;
  passwordLastUpdated: Date;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
