import { Injectable } from "@nestjs/common";

/**
 * 실제 root에 관련된 비즈니스 로직이 정의된 객체.
 */
@Injectable()
export class RootService {
    getHello(): string {
        return "Hello, Root Service!";
    }
}
