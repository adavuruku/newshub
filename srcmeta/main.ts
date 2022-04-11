import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ResponseFilter } from './_shared/filters/response.filter/response.filter';
import { ValidationPipe } from './_shared/pipes';
import { WalletAddressGuards } from '../../../auth/guards/wallet-address.guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.use(morgan('tiny'));
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new ResponseFilter());
  app.useGlobalPipes(new ValidationPipe());
  //guard for wallet address
  app.useGlobalGuards(new WalletAddressGuards());
  const config = app.get(ConfigService);

  // if (config.get('service.enableSwagger')) {
  //   const options = new DocumentBuilder()
  //     .setTitle('MetaComic Service')
  //     .setDescription('The MetaComic Service API description')
  //     .setVersion('0.0.1')
  //     .addBearerAuth()
  //     .build();
  //   const document = SwaggerModule.createDocument(app, options);
  //   SwaggerModule.setup('api', app, document);
  // }

  if (true) {
    const options = new DocumentBuilder()
      .setTitle('MetaComic Service')
      .setDescription('The MetaComic Service API description')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(config.get('service.port'), () =>
    Logger.log(
      `App Service is listening at port ${config.get('service.port')} ...`,
    ),
  );
}

bootstrap();
