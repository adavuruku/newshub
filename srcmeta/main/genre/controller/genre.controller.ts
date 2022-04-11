import { UpdateAttributeDto } from './../../../dtos/attributes/update-attribute.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { GenreService } from '../service/genre.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NextFunction } from 'express';
import { Pagination, QueryParser } from '../../../_shared/common';
// import { UpdateDto } from '../dto/updateDto/updateDto';
import { CreateGenre } from '../../../dtos/genre/createGenre';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @ApiOperation({ summary: 'Find Genre' })
  @Get('/')
  async findGenres(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.genreService.baseUrl,
        this.genreService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.genreService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.genreService.getResponse({
        code: HttpStatus.OK,
        value,
        count,
        queryParser,
        pagination,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Create Genre' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createGenre(
    @Body() body: CreateGenre,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      body = Object.assign(body, { walletAddress: req.walletAddress });
      let value = await this.genreService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.genreService.create({
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.genreService.identifier}_id`],
      });
      const response = await this.genreService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Get Attribute' })
  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.genreService.get(id, queryParser);
      const response = await this.genreService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Update Genre' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.genreService.update(id, updateAttributeDto);
      const response = await this.genreService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Delete Genre' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.genreService.delete(id);
      const response = await this.genreService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
