import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./filter/http-exception.filter";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        //
        // APP_FILTER 토큰을 사용한 모듈레벨의 필터등록.
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
