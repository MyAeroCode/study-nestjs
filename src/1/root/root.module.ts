import { Module } from "@nestjs/common";
import { RootController } from "./root.controller";
import { RootService } from "./root.service";

/**
 * root에 관련된 기능이 캡슐화된 객체.
 */
@Module({
    imports: [],
    controllers: [RootController],
    providers: [RootService],
})
export class RootModule {}
