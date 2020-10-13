import { Controller, Get } from "@nestjs/common";
import { RootService } from "./root.service";

/**
 * "/"로 들어오는 요청을 컨트롤하는 라우터.
 */
@Controller()
export class RootController {
    constructor(private readonly rootService: RootService) {}

    /**
     * "/"를 기준으로 "/"로 들어오는 GET 요청을 처리한다.
     */
    @Get()
    getHello(): string {
        return this.rootService.getHello();
    }
}
