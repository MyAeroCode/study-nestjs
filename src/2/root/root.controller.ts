import {
    Body,
    Controller,
    Get,
    Header,
    Headers,
    HttpCode,
    HttpStatus,
    Ip,
    Param,
    Post,
    Query,
    Redirect,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { PayloadDTO } from "./entities/dto/payload.dto";

@Controller()
export class RootController {
    /**
     * "/"로 들어오는 GET 요청을 처리한다.
     */
    @Get()
    get(): string {
        return "GET /";
    }

    /**
     * "/hello"로 들어오는 POST 요청을 처리한다.
     *
     * POST 응답의 기본 코드는 201로 설정되어 있지만,
     * HttpCode 데코레이터를 사용하여 변경할 수 있음.
     *
     * Header 데코레이터를 사용하여 추가적인 헤더 정보를 반환할 수 있음.
     */
    @Post("hello")
    @HttpCode(200)
    @Header("header-1", "1")
    @Header("header-2", "2")
    post(): string {
        return "POST /";
    }

    /**
     * 와일드카드(*, +, ?)를 사용할 수 있음.
     */
    @Get("xy*")
    getWildcard(): string {
        return "GET /xy*";
    }

    /**
     * 단, 하이픈(-)과 점(.)은 문자로 해석되므로 주의.
     */
    @Get("ab.")
    getInvaildWildcard(): string {
        return "GET /ab.";
    }

    /**
     * 다른 페이지로 리다이렉트.
     */
    @Get("redirect")
    @Redirect("https://naver.com", 301)
    redirect(): string {
        return "GET /redirect";
    }

    /**
     * 라우팅 파라미터 사용하기.
     *
     * 익스프레스와 마찬가지로 :name 형식을 따를 것.
     * 코드에서 해당 파라미터를 얻으려면 Param 데코레이터를 사용한다.
     *
     * 기본적으로 파라미터는 string이지만,
     * app에 변환옵션을 설정한 ValidationPipe를 넘기면 파라미터가 원하는 타입으로 변경된다.
     */
    @Get("param/:id")
    param(@Param("id") userId: number): string {
        return `GET /param/:id WITH [${userId}]`;
    }

    /**
     * 요청에서 쿼리 스트링 추출하기.
     *
     * 기본적으로 쿼리 스트링은 string이지만,
     * app에 변환옵션을 설정한 ValidationPipe를 넘기면 파라미터가 원하는 타입으로 변경된다.
     */
    @Get("query")
    query(@Query("id") userId: number): string {
        return `GET /query WITH [?id=${userId}]`;
    }

    /**
     * 페이로드 추출하기.
     *
     * 페이로드에 데이터 타입을 정의하려면 DTO 클래스를 생성하여 사용한다.
     * 실제로 DTO 타입인지 검사하기 위해서는, ValidationPipe에 추가적인 옵션을 넘겨야 한다.
     */
    @Post("payload")
    payload(@Body() payload: PayloadDTO): PayloadDTO {
        return payload;
    }

    /**
     * 요청에서 특정 헤더를 추출하려면 Headers 데코레이터를 사용할 것.
     */
    @Get("reqHeader")
    reqHeader(@Headers("id") userId: number): number {
        return userId;
    }

    /**
     * 클라이언트의 아이피 추출.
     * 동적 헤더 설정.
     */
    @Get("ip")
    ip(@Ip() ip: string, @Res() res: Response): void {
        res.set("ip", ip);
        res.write(ip);
        res.status(HttpStatus.OK).send();
    }
}
