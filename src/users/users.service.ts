import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async getUserById(id: string): Promise<{ id: string; email: string } | null> {
    // TODO: look up user via Prisma once PrismaService is wired
    void id;
    return null;
  }
}
