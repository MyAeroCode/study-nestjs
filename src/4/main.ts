import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from "cors";
import helmet from "helmet";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //
    // 글로벌 미들웨어.
    app.use(cors(), helmet());
    await app.listen(3000);
}
