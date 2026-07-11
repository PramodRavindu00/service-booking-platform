import * as bcrypt from 'bcrypt';
const SALTS = 10;

export const passwordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALTS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
