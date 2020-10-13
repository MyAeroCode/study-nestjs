import { Injectable } from "@nestjs/common";

/**
 * 실제 echo에 관련된 비즈니스 로직이 정의된 객체.
 */
@Injectable()
export class EchoService {
    getHello(): string {
        return "Hello, Echo Service!";
    }

    getVersion(): string {
        return "1.0.0";
    }
}
