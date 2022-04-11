import { CreateSeriesDto } from './../../../dtos/series/create-series.dto';
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
  HttpCode,
  Put,
} from '@nestjs/common';
import { SeriesService } from '../service/series.service';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateSeriesDto } from '../../../../../service/src/dtos/series/update-series.dto';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @ApiOperation({ summary: 'Create Series' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() body: CreateSeriesDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      let value = await this.seriesService.retrieveExistingResource(body);
      if (value === null) {
        value = await this.seriesService.create({
          walletAddres: req.walletAddress,
          ...body,
        });
      }
      Object.assign(queryParser.query, {
        id: value[`${this.seriesService.identifier}_id`],
      });
      const response = await this.seriesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Find All Series' })
  @Get()
  async findAll(@Res() res, @Req() req, @Next() next: NextFunction) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.seriesService.baseUrl,
        this.seriesService.itemsPerPage,
      );
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const { value, count } = await this.seriesService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.seriesService.getResponse({
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

  @ApiOperation({ summary: 'Get Series' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.seriesService.get(id, queryParser.query);
      const response = await this.seriesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Update Series' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.seriesService.update(id, updateSeriesDto);
      const response = await this.seriesService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperation({ summary: 'Delete Series' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.seriesService.delete(id);
      const response = await this.seriesService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
