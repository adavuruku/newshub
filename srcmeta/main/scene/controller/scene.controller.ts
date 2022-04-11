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
  Query,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SceneQueryDto } from '../../../../../service/src/dtos/scene/scene-query.dto';
import {
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import { NextFunction } from 'express';
import { CreateSceneDto } from '../../../dtos/scene/create-scene.dto';
import { UpdateSceneDto } from '../../../dtos/scene/update-scene.dto';
import { SceneService } from '../service/scene.service';

@ApiTags('Scene')
@Controller('scene')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @ApiOperation({ summary: 'Create Scene' })
  @Post()
  async create(
    @Body() body: CreateSceneDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.sceneService.create({
        walletAddess: req.walletAddress,
        ...body,
      });
      Object.assign(queryParser.query, {
        id: value[`${this.sceneService.identifier}_id`],
      });
      const response = await this.sceneService.getResponse({
        code: HttpStatus.OK,
        value,
        queryParser,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all Scene' })
  async findAll(
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
    @Query() query: SceneQueryDto,
  ) {
    try {
      const pagination = new Pagination(
        req.originalUrl,
        this.sceneService.baseUrl,
        this.sceneService.itemsPerPage,
      );

      const queryParser = new QueryParser(Object.assign({}, query));
      const { value, count } = await this.sceneService.find(queryParser);
      //remove population from find
      queryParser.population = [];
      const response = await this.sceneService.getResponse({
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
  @ApiOperation({ summary: 'Get Scene' })
  async findOne(
    @Param('id') id: string,
    @Query() query: SceneQueryDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(query, req.params);
      const queryParser = new QueryParser(Object.assign({}, query));
      const value = await this.sceneService.get(id, queryParser);
      const response = await this.sceneService.getResponse({
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
  @ApiOperation({ summary: 'Update Scene' })
  async update(
    @Param('id') id: string,
    @Body() updateSceneDto: UpdateSceneDto,
    @Res() res,
    @Req() req,
    @Next() next: NextFunction,
  ) {
    try {
      Object.assign(req.query, req.params);
      const queryParser = new QueryParser(Object.assign({}, req.query));
      const value = await this.sceneService.update(id, updateSceneDto);
      const response = await this.sceneService.getResponse({
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
  @ApiOperation({ summary: 'Delete Scene' })
  async remove(
    @Param('id') id: string,
    @Res() res,
    @Next() next: NextFunction,
  ) {
    try {
      const value = await this.sceneService.delete(id);
      const response = await this.sceneService.getResponse({
        code: HttpStatus.OK,
        value,
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
