import { Module } from '@nestjs/common';
import { EthNameRecordService } from './record.service';
import { EthNameRecordController } from './record.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EthNameRecord, EthNameRecordSchema } from 'src/models/records.schema';
import { Name, NameSchema } from 'src/models/names.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EthNameRecord.name, schema: EthNameRecordSchema },
      { name: Name.name, schema: NameSchema },
    ]),
  ],
  controllers: [EthNameRecordController],
  providers: [EthNameRecordService],
})
export class RecordModule {}
