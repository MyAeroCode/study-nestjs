import { Module } from "@nestjs/common";
import { EchoController } from "./echo.controller";
import { EchoService } from "./echo.service";

/**
 * echo에 관련된 기능이 캡슐화된 객체.
 */
@Module({
    imports: [],
    controllers: [EchoController],
    providers: [EchoService],
})
export class EchoModule {}
