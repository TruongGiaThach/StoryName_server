import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chain, ChainSchema } from 'src/models/chain.schema';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chain.name, schema: ChainSchema }]),
    AuthModule,
  ],
  providers: [ChainService],
  controllers: [ChainController],
  exports: [ChainService],
})
export class ChainModule {}
