import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { existsSync, mkdirSync } from 'fs';
import { setupSwagger } from './utils/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  // 서버 HTTPS 적용 (개발시에는 mkcert 사용)
  const httpsOptions = {
    key: fs.readFileSync(
      'C:\\echeck\\backend\\echeck-backend\\ssl\\localhost+3-key.pem',
    ),
    cert: fs.readFileSync(
      'C:\\echeck\\backend\\echeck-backend\\ssl\\localhost+3.pem',
    ),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // 파일 업로드 폴더 명시
  const uploadPath = 'uploads';

  if (!existsSync(uploadPath)) {
    // uploads 폴더가 존재하지 않을시, 생성합니다.
    mkdirSync(uploadPath);
  }

  // 쿠키파서 미들웨어 사용
  app.use(cookieParser());

  //예외 필터 연결
  app.useGlobalFilters(new HttpExceptionFilter());

  //Global Middleware 설정 -> Cors 속성 활성화
  app.enableCors({
    origin: true,
    // origin: [
    //   'http://125.141.68.149',
    //   'http://192.168.0.123',
    //   'http://192.168.0.198',
    //   'http://localhost',
    // ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: DTO에 없은 속성은 무조건 거른다.
       * forbidNonWhitelisted: 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생합니다.
       * transform: 네트워크를 통해 들어오는 데이터는 일반 JavaScript 객체입니다.
       *            객체를 자동으로 DTO로 변환을 원하면 transform 값을 true로 설정한다.
       * disableErrorMessages: Error가 발생 했을 때 Error Message를 표시 여부 설정(true: 표시하지 않음, false: 표시함)
       *                       배포 환경에서는 true로 설정하는 걸 추천합니다.
       */
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: true,
    }),
  );

  //Swagger 환경설정 연결
  setupSwagger(app);

  await app.listen(8989, '0.0.0.0');
}
bootstrap();
