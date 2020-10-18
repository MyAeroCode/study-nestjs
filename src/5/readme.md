## Exception Filters

로직 처리중 특정 익셉션이 발생했을 때 호출되는 콜백 메서드를 가진 객체를 `Exception Filter`라고 하며, 이러한 필터가 여러개 모여서 `Exception Filter Layer`를 이룹니다. `Nest.JS`는 기본적으로 핸들링되지 않은 익셉션을 캐치하는 `내장 예외 필터`를 가집니다.

---

## Throw Exception

`Nest.JS`에서 다루는 익셉션은 기본적으로 3개의 정보를 갖습니다.

-   `예외 이름`
-   `상태 코드`
-   `메세지`

**기본적인 익셉션 발생 :**

```ts
@Injectable()
export class AppService {
    //
    // 기본 익셉션 발생
    // 메세지는 Forbidden 예외의 기본값을 사용.
    occurStandardException(): string {
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
}
```

**커스텀 메세지 익셉션 발생 :**

```ts
@Injectable()
export class AppService {
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
```

**커스텀 클래스 익셉션을 발생 :**

```ts
export class ForbiddenException extends HttpException {
    constructor() {
        super("Forbidden", HttpStatus.FORBIDDEN);
    }
}

@Injectable()
export class AppService {
    //
    // 사용자가 확장한 익셉션 발생
    occurCustomException(): string {
        throw new ForbiddenException();
    }
}
```

---

## Define Exception Filter

`@Catch` 데코레이터를 사용하여 예외 필터를 정의할 수 있습니다. 해당 데코레이터에 0개 이상의 익셉션 클래스를 전달할 수 있습니다.

-   `0개 이하` : 모든 익셉션을 캐치
-   `1개 이상` : 리스트에 주어진 익셉션만 캐치

```ts
@Catch(HttpException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        //
        // 핸들러 대신, 예외 필터가 응답을 반환.
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
```

---

## Bind Exception Filter

예외 필터는 `컨트롤러 함수`, `컨트롤러 객체`, `모듈`, `앱`에 적용할 수 있습니다.

**컨트롤러 함수 :**

`@UseFilters(...class)`의 형태의 데코레이터를 사용합니다. `class` 대신 `instance`를 넘겨도 되지만 `class를 사용해야 싱글톤을 공유할 수 있으므로` 메모리 사용량이 절약됩니다.

```ts
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("catch")
    @UseFilters(HttpExceptionFilter)
    // instead of @UseFilters(new HttpExceptionFilter())
    catch(): string {
        return this.appService.occurStandardException();
    }
}
```

**컨트롤러 객체 :**

`@UseFilters(...class)`를 컨트롤러 위에 선언하세요.

```ts
@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
    constructor(private readonly appService: AppService) {}
}
```

**모듈 :**

`Provider`에 예외 필터를 제공하여 해당 모듈 전체에 적용시킬 수 있습니다. 이 때 `APP_FILTER` 토큰을 사용해야 합니다.

```ts
import { APP_FILTER } from "@nestjs/core";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        //
        // APP_FILTER 토큰을 사용한 모듈레벨의 필터등록.
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
```

**앱 (글로벌) :**

`app.useGlobalFilters`를 사용하여 글로벌하게 적용할 수 있습니다. 다만, 이 방법을 통해 적용된 필터는 `하이브리드 앱`과 `게이트웨이`에 적용되지 않습니다. 아래의 코드 대신, 루트 모듈에 적용하는 것을 추천합니다.

```ts
export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(HttpExceptionFilter);
    await app.listen(3000);
}
```
