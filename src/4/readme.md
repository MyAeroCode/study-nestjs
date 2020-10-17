## Middleware

`요청 핸들러`에 의해 요청이 처리되기 전에 실행되는 로직. 기본적인 내용은 `Express.js`의 미들웨어와 같다.

-   `req, res, next`를 인자로 받음.
-   `next`에 파라미터가 넘겨지면 에러로 해석됨.

**Class Middleware :**

```ts
/**
 * 클래스 형태의 미들웨어.
 * 해당 미들웨어가 다른 객체에 의존성이 있는 경우에 사용.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    //
    // CounterService가 의존성으로 주입됨.
    constructor(readonly service: CounterService) {}

    use(req: Request, res: Response, next: Function) {
        console.log(`Request... ${this.service.getValue()}`);

        //
        // next()가 호출되지 않으면 무한대기.
        // next()에 인자가 넘겨지면 에러.
        next();
    }
}
```

**Funtional Middleware :**

```ts
/**
 * 함수 형태의 미들웨어.
 * 의존성이 없는 경우에 사용.
 */
export function FunctionalLoggerMiddleware(
    req: Request,
    res: Response,
    next: Function,
) {
    console.log("Request...");
    next();
}
```

---

## Regist Middleware Into Module

**Global Scope :**

`Express.js`와 같이 `use`를 통해 등록한다.

```ts
export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //
    // 글로벌 미들웨어.
    app.use(cors(), helmet());
    await app.listen(3000);
}
```

**Local Scope :**

또는 로컬 모듈에 `apply`를 통해 등록한다.

```ts
@Module({
    imports: [],
    controllers: [CounterController],
    providers: [CounterService],
})
export class CounterModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        //
        // 단순 문자열 경로에 미들웨어 적용.
        // 한번에 여러개 적용 가능.
        consumer.apply(cors(), helmet(), LoggerMiddleware).forRoutes("*");

        //
        // 경로 + 메소드에 미들웨어 적용.
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });

        //
        // 컨트롤러에 미들웨어 적용.
        // 특정 경로는 제외. (위의 코드에도 영향을 줌.)
        // 따라서, "/" 경로는 미들웨어가 3번 호출되지만,
        // "/count" 경로는 미들웨어가 0번 호출됨.
        consumer
            .apply(LoggerMiddleware)
            .exclude(
                { path: "count", method: RequestMethod.GET },
                { path: "count", method: RequestMethod.POST },
                "/count/*",
            )
            .forRoutes(CounterController);
    }
}
```
