import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EthNameRecordService } from './record.service';
import { EthNameRecord } from 'src/models/records.schema';
import { CreateEthNameRecordDto } from './dto/create-record.dto';
import { FilterQuery } from 'mongoose';
import { UpdateEthNameRecordDto } from './dto/update-record.dto';
import { QueryFilterRecordDto } from './dto/filter-record.dto';
import { JWT, UserJWT, iInfoToken } from 'src/modules/jwt';

@ApiTags('records')
@Controller('records')
export class EthNameRecordController {
  constructor(private readonly ethNameRecordService: EthNameRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new EthNameRecord' })
  @JWT()
  @ApiResponse({
    status: 201,
    description: 'The EthNameRecord has been successfully created.',
    type: EthNameRecord,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createEthNameRecordDto: CreateEthNameRecordDto,
    @UserJWT() user: iInfoToken,
  ): Promise<EthNameRecord> {
    return this.ethNameRecordService.create(
      createEthNameRecordDto,
      user.userAddress,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all EthNameRecords' })
  @ApiResponse({
    status: 200,
    description: 'Return all EthNameRecords.',
    type: [EthNameRecord],
  })
  async findAll(): Promise<EthNameRecord[]> {
    return this.ethNameRecordService.findAll();
  }

  @Get('filter')
  @ApiOperation({ summary: 'Find an EthNameRecord by query parameters' })
  @ApiResponse({
    status: 200,
    description: 'The EthNameRecord found',
    type: EthNameRecord,
  })
  @ApiResponse({ status: 404, description: 'EthNameRecord not found' })
  async findOne(
    @Query() query: FilterQuery<QueryFilterRecordDto>,
  ): Promise<EthNameRecord> {
    return await this.ethNameRecordService.findOne(query);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete an EthNameRecord by Name' })
  @JWT()
  @ApiResponse({
    status: 200,
    description: 'The EthNameRecord has been successfully deleted.',
    type: EthNameRecord,
  })
  @ApiResponse({ status: 404, description: 'EthNameRecord not found' })
  async remove(
    @Param('name') name: string,
    @UserJWT() user: iInfoToken,
  ): Promise<EthNameRecord> {
    return this.ethNameRecordService.remove(name, user.userAddress);
  }

  @Patch('update-by-name/:name')
  @ApiOperation({ summary: 'Update an existing name record by name' })
  @JWT()
  @ApiResponse({
    status: 200,
    description: 'The name record has been successfully updated.',
    type: UpdateEthNameRecordDto,
  })
  @ApiResponse({ status: 404, description: 'Name record not found.' })
  async updateByName(
    @Param('name') name: string,
    @Body() updateEthNameRecordDto: UpdateEthNameRecordDto,
    @UserJWT() user: iInfoToken,
  ): Promise<EthNameRecord> {
    return this.ethNameRecordService.updateByName(
      name,
      updateEthNameRecordDto,
      user.userAddress,
    );
  }
}
