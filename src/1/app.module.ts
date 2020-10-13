import { Module } from "@nestjs/common";
import { EchoModule } from "./echo/echo.module";
import { RootModule } from "./root/root.module";

/**
 * 전체 기능을 캡슐화한 객체.
 * 즉, 하나의 앱은 하나의 루트 모듈을 갖는다.
 */
@Module({
    imports: [RootModule, EchoModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
