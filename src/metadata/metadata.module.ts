import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Metadata, MetadataSchema } from 'src/models/metadata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Metadata.name,
        schema: MetadataSchema,
      },
    ]),
  ],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
