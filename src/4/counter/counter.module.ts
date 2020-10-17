import cors from "cors";
import helmet from "helmet";
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { CounterController } from "./counter.controller";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { CounterService } from "./counter.service";

@Module({
    imports: [],
    controllers: [CounterController],
    providers: [CounterService],
})
export class CounterModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        //
        // 단순 문자열 경로에 미들웨어 적용.
        // 한번에 여러개 적용 가능.
        consumer.apply(cors(), helmet(), LoggerMiddleware).forRoutes("*");

        //
        // 경로 + 메소드에 미들웨어 적용.
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });

        //
        // 컨트롤러에 미들웨어 적용.
        // 특정 경로는 제외. (위의 코드에도 영향을 줌.)
        // 따라서, "/" 경로는 미들웨어가 3번 호출되지만,
        // "/count" 경로는 미들웨어가 0번 호출됨.
        consumer
            .apply(LoggerMiddleware)
            .exclude(
                { path: "count", method: RequestMethod.GET },
                { path: "count", method: RequestMethod.POST },
                "/count/*",
            )
            .forRoutes(CounterController);
    }
}
