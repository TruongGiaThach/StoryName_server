import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { ChainService } from './chain.service';
import { CreateChainDto } from './dto/create-chain.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { QueryFilterChainDto } from './dto/filter-chain.dto';

// TODO: only Admin can manage chain
@ApiTags('chains')
@Controller('chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chain' })
  create(@Body() createChainDto: CreateChainDto) {
    return this.chainService.create(createChainDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all blockchain' })
  findAll() {
    return this.chainService.findAll();
  }

  @Get('filter')
  @ApiOperation({ summary: 'Find a blockchain chain by query parameters' })
  async findOne(@Query() query: QueryFilterChainDto) {
    return await this.chainService.findOne(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blockchain chain by ID' })
  @ApiParam({ name: 'id', description: 'ID of the blockchain chain to delete' })
  remove(@Param('id') id: string) {
    return this.chainService.remove(id);
  }
}
