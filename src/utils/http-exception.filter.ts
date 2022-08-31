import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * @Catch(HttpException)
 * 해당 데코레이터는 필요한 메타 데이터를 ExceptionFilter에 바인딩하여,
 * 필터가 HttpException 타입의 예외만 찾고 있다는 것을 Nset.js에 알리기 위해 선언한다.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * @author 박현진 팀장
   * @description 예외 처리 함수
   *
   * @param exception 현재 처리 중인 예외 객체
   * @param host ArgumentsHost 객체 -> 핸들러에 전달되는 인수를 검색하는 메서드를 제공한다 (Express를 사용하는 경우 - Response & Request & Next 제공)
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // HttpException에서 전송한 데이터를 추출할 때 사용
    const res: any = exception.getResponse();

    //요청 시간 정보
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset);
    const timestamp: string = today.toISOString();

    console.log(res);

    console.log('요청 url : ', request.url);
    console.log('error message : ', res.message);
    console.log('status code : ', res.statusCode);
    console.log('error code : ', res.error ? res.error : 'client error');
    console.log('발생 시간 : ', timestamp);

    /* 클라이언트에게 정보를 전달한다. */
    response.status(status).json({
      code: '9999',
      message: '요청 처리에 실패하였습니다.',
      result: res.message,
    });
  }
}
