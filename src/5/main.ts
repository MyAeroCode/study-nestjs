import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //
    // 글로벌 필터.
    // 여기서는 아무것도 바인딩하지 않음.
    // 해당 방법으로는 게이트웨이나 하이브리드 어플리케이션에 영향을 줄 수 없음.
    app.useGlobalFilters();
    await app.listen(3000);
}
