import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ForbiddenException } from "./exception/forbidden.exception";

@Injectable()
export class AppService {
    //
    // 기본 익셉션 발생
    occurStandardException(): string {
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    //
    // 사용자가 확장한 익셉션 발생
    occurCustomException(): string {
        throw new ForbiddenException();
    }

    //
    // 기본 익셉션의 메세지를 수정하여 발생
    occurCustomMessageException(): string {
        throw new HttpException(
            {
                status: HttpStatus.FORBIDDEN,
                error: "This is a custom message",
            },
            HttpStatus.FORBIDDEN,
        );
    }
}
