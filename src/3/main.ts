import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            //
            // 데코레이터가 설정되어 있지 않은 프로퍼티는 제거됩니다.
            whitelist: true,

            //
            // 데코레이터가 설정되어 있지 않은 프로퍼티가 전달되면 에러를 발생시킵니다.
            forbidNonWhitelisted: true,

            //
            // url param을 실제 원하는 타입으로 변환합니다.
            transform: true,
        }),
    );
    await app.listen(3000);
}
