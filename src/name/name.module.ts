import { Module } from '@nestjs/common';
import { NameService } from './name.service';
import { NameController } from './name.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Name, NameSchema } from 'src/models/names.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChainModule } from 'src/chain/chain.module';
import { CommitmentModule } from 'src/commitment/commitment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Name.name, schema: NameSchema }]),
    AuthModule,
    UserModule,
    ChainModule,
    CommitmentModule,
  ],
  controllers: [NameController],
  providers: [NameService],
})
export class NameModule {}
