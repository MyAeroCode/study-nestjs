import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { CounterService } from "../counter/counter.service";

/**
 * 클래스 형태의 미들웨어.
 * 해당 미들웨어가 다른 객체에 의존성이 있는 경우에 사용.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(readonly service: CounterService) {}
    use(req: Request, res: Response, next: Function) {
        console.log(`Request... ${this.service.getValue()}`);

        //
        // next()가 호출되지 않으면 무한대기.
        // next()에 인자가 넘겨지면 에러.
        next();
    }
}

/**
 * 함수 형태의 미들웨어.
 * 의존성이 없는 경우에 사용.
 */
export function FunctionalLoggerMiddleware(
    req: Request,
    res: Response,
    next: Function,
) {
    console.log("Request...");
    next();
}
