import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  Next,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCharacterDto } from '../../../../../service/src/dtos/character/create-character.dto';
import { UpdateCharacterDto } from '../../../../../service/src/dtos/character/update-character.dto';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { CharacterService } from '../service/character.service';

@ApiTags('Characters')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Create Characters' })
  async create(
    @Body() body: CreateCharacterDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      let value = await this.characterService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.characterService.create({
          walletAddres: req.walletAddress,
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.characterService.identifier}_id`],
      });
      const response = await this.characterService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all Characters' })
  async findAll(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.characterService.baseUrl,
        this.characterService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.characterService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.characterService.getResponse({
        code: HttpStatus.OK,
        value,
        count,
        queryParser,
        pagination,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Character' })
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.characterService.get(id, queryParser.query);
      const response = await this.characterService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Character' })
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.characterService.update(id, updateCharacterDto);
      const response = await this.characterService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Character' })
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.characterService.delete(id);
      const response = await this.characterService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
