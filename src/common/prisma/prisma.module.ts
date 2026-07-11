import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // make as a global module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
