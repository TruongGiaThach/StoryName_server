import { Module } from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CommitmentController } from './commitment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commitment, CommitmentSchema } from 'src/models/commitment.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commitment.name, schema: CommitmentSchema },
    ]),
    AuthModule,
  ],
  controllers: [CommitmentController],
  providers: [CommitmentService],
  exports: [CommitmentService],
})
export class CommitmentModule {}
