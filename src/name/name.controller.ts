import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { NameService } from './name.service';
import { CreateNameDto } from './dto/create-name.dto';
import { Name } from 'src/models/names.schema';
import { QueryFilterNameDto } from './dto/filter-name.dto';
import { iInfoToken, JWT, UserJWT } from 'src/modules/jwt';
import { HttpCode } from '@nestjs/common';
import { BaseResult } from 'src/utils/base.result';
import { NameDto } from 'src/utils/models/dtos/name.dto';

@ApiTags('names')
@Controller('names')
export class NameController {
  constructor(private readonly nameService: NameService) {}

  @JWT()
  @HttpCode(200)
  @Post()
  @ApiOperation({ summary: 'Create a new name' })
  @ApiOkResponse({
    description: 'The name has been successfully created.',
    type: Name,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createNameDto: CreateNameDto,
    @UserJWT() token: iInfoToken,
  ): Promise<BaseResult<NameDto>> {
    return this.nameService.create(createNameDto, token.userAddress);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Find names by query parameters' })
  @ApiOkResponse({ status: 200, description: 'Names found', type: [Name] })
  @ApiResponse({ status: 404, description: 'Names not found' })
  async find(@Query() query: QueryFilterNameDto): Promise<BaseResult<NameDto>> {
    return await this.nameService.findOne(query);
  }

  @JWT()
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a name by ID' })
  @ApiResponse({
    status: 200,
    description: 'The name has been successfully deleted.',
    type: Name,
  })
  @ApiResponse({ status: 404, description: 'Name not found.' })
  async remove(@Param('id') id: string, @UserJWT() token: iInfoToken) {
    return this.nameService.remove(id, token.userAddress);
  }

  @JWT()
  @Post('/setPrimaryName/:name')
  @ApiResponse({
    status: 200,
    description: 'The name has been set as Primary successfully',
    type: Name,
  })
  @ApiResponse({ status: 404, description: 'Name not found.' })
  @ApiOperation({ summary: 'Set this name as Primary Name' })
  async setPrimaryName(
    @Param('name') name: string,
    @UserJWT() token: iInfoToken,
  ) {
    return this.nameService.setPrimaryName(name, token.userAddress);
  }

  @JWT()
  @Get('findAllByOwner')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all names successfully',
    type: [Name],
  })
  @ApiResponse({ status: 404, description: 'No names found.' })
  @ApiOperation({
    summary: 'Retrieve all names for the authenticated user (owner)',
  })
  async findAll(@UserJWT() token: iInfoToken) {
    return this.nameService.findAll(token.userAddress);
  }
}
