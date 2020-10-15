## Controller

서버에 들어온 클라이언트의 요청을 라우팅하는 객체.

---

## Add End-Point

### Basics

`RestFul Method`의 이름을 갖는 데코레이터를 컨트롤러 내부함수에 사용하여 새로운 엔드포인트를 등록할 수 있습니다. 이 데코레이터는 라우팅할 경로를 인자로 받을 수 있으며, 주어지지 않는다면 `/`에 매칭됩니다.

```ts
@Get()
getHello(){
    return "GET /"
}

@Post("admin")
postAdmin(){
    return "POST /ADMIN"
}
```

### Wildcards

일부 와일드카드 문자(`?, *, +`)를 사용할 수 있습니다.

```ts
@Get("xy*") // "xy", "xyz", "xyk", ...
```

단 하이픈(`-`)과 닷(`.`)은 와일드카드로 해석되지 않습니다.

```ts
@Get("xy-") // only "xy-"
@Get("xy.") // only "xy."
```

### Path Param

익스프레스와 같이 `:name`의 형태로 동적 경로를 구성할 수 있습니다.

```ts
@Get("user/:id")
```

---

## Extract Request Info

### Query

`@Query` 데코레이터를 사용하여 쿼리 문자열을 뽑아낼 수 있습니다.

```ts
GET /hello?name=AeroCode
```

```ts
@Get()
getHello(@Query("name") userName:string) : string{
    return `Hello, ${userName}!`; // Hello, AeroCode!
}
```

### Path Param

`@Param` 데코레이터를 사용하여 동적 경로에 매칭된 정보를 가져올 수 있습니다.

```ts
GET / user / 12345;
```

```ts
@Get("hello/:name")
getHello(@Param("name") userName:string) : string{
    return `Hello, ${userName}!`;
}
```

### Request Header

`@Headers` 데코레이터를 사용하여 요청 헤더에 적힌 내용을 가져올 수 있습니다.

```ts
@Get()
getHello(@Headers("name") userName:string) : string{
     return `Hello, ${userName}!`;
}
```

### User IP

`@Ip` 데코레이터를 사용하여 클라이언트의 아이피 주소를 얻어낼 수 있습니다.

```ts
@Get()
clientIp(@Ip() ip:string):string{
    return `Your IP : ${ip}`;
}
```

### Payload

`@Body()` 데코레이터를 사용하여 페이로드를 얻어올 수 있습니다.

```ts
@Post()
payload(@Body() data : any) : any {
    return data;
}
```

페이로드에 자료형을 명시하기 위해 `DTO Class`를 사용합니다.

```ts
class PayloadDTO {
    key : string;
    val : string;
}

@Post()
payload(@Body() data : PayloadDTO) : PayloadDTO {
    return data;
}
```

페이로드와 자료형이 일치하는지 검사하기 위해 `class-validator`와 `ValidationPipe`를 사용합니다. 페이로드가 해당 자료형이 아닌경우 에러를 발생시킵니다.

```ts
import { IsString, IsNumber } from "class-validator";

class PayloadDTO {
    @IsString()
    key : string;

    @IsNumber()
    val : string;
}

@Post()
payload(@Body() data : PayloadDTO) : PayloadDTO {
    return data;
}
```

```ts
export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            //
            // class-validator 데코레이터가 설정되어 있지 않은 프로퍼티는 제거됩니다.
            whitelist: true,

            //
            // class-validator 데코레이터가 설정되어 있지 않은 프로퍼티가 전달되면 에러를 발생시킵니다.
            forbidNonWhitelisted: true,
        }),
    );
    await app.listen(3000);
}
```

---

## Response

### Static Header

`@Header(key, val)` 데코레이터를 사용하여 정적 헤더를 삽입할 수 있습니다.

```ts
@Get()
@Header("key1", "val1")
@Header("key2", "val2")
getHello() : string {
    return "Hello, World!";
}
```

### Dynamic Header

동적 헤더를 설정하는 스탠다드 방법은 현재 없습니다. `@Res` 데코레이터를 사용하여 `Express Response` 객체를 얻어오고, 여기에 직접 헤더를 써야 합니다.

```ts
import { Response, HttpStatus } from "express";

@Get()
getHello(@Res() res : Response) : void {
    res.set("random", Math.random());
    res.write("Hello, World!");
    res.status(HttpStatus.OK).send();
}
```

### HttpStatus

`@HttpCode(code)` 데코레이터를 사용하여 응답코드를 설정할 수 있습니다. `GET` 요청의 기본 응답값은 200, `POST` 요청의 기본 응답값은 201입니다.

```ts
@Post()
@HttpCode(200)
postHello() : string {
    return "Hello, World!";
}
```

### Redirect

`@Redirect(to, code)` 데코레이터를 사용하여 요청을 리다이렉트할 수 있습니다.

```ts
@Get()
@Redirect("https://naver.com", HttpStatus.TEMPORARY_REDIRECT)
redirect() : string {
    return "redirected";
}
```
