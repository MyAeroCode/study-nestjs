import { Controller, Get, UseFilters } from "@nestjs/common";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./filter/http-exception.filter";

//
// 필터를 컨트롤러에 바인딩.
// 여기서는 아무것도 바인딩하지 않음.
@UseFilters()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("standard")
    standardException(): string {
        return this.appService.occurStandardException();
    }

    @Get("customMessage")
    customMessageException(): string {
        return this.appService.occurCustomMessageException();
    }

    @Get("custom")
    customException(): string {
        return this.appService.occurCustomException();
    }

    //
    // 필터를 핸들러에 바인딩.
    // @UseFilters(new HttpExceptionFilter())도 가능하지만,
    // 객체보다는 클래스로 넘겨줘야 동일한 객체를 재사용하여 메모리 사용량을 줄일 수 있음.
    @Get("catch")
    @UseFilters(HttpExceptionFilter)
    catch(): string {
        return this.appService.occurStandardException();
    }
}
