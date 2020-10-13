import { Controller, Get } from "@nestjs/common";
import { EchoService } from "./echo.service";

/**
 * "/echo"로 들어오는 요청을 컨트롤하는 라우터.
 */
@Controller("/echo")
export class EchoController {
    /**
     * echoService를 컨트롤러에 인젝션한다.
     */
    constructor(private readonly echoService: EchoService) {}

    /**
     * "/echo"에 들어온 GET 요청을 처리한다.
     */
    @Get()
    getVersion(): string {
        return this.echoService.getHello();
    }

    /**
     * "/echo/version"에 들어온 GET 요청을 처리한다.
     */
    @Get("version")
    getQuery(): string {
        return this.echoService.getVersion();
    }
}
