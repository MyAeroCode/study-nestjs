import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

//
// 여기서는 HttpException만 캐치한다.
// 모든 익셉션을 캐치하고 싶다면 아무 인자도 넘겨주지 않아야 한다.
// 콤마 리스트를 줘서 여러개를 캐치할 수도 있음.
@Catch(HttpException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
