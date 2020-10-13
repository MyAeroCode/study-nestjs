## Basic Concepts

아래의 3가지 구성요소만으로 기본적인 `Nest.JS` 서버를 만들 수 있습니다.

-   `Service` : 비즈니스 로직이 정의된 객체.
-   `Controller` : 서버에 들어온 요청을 라우팅하는 객체.
-   `Module` : 여러개의 `Contoller`와 `Service`를 캡슐화한 객체.

---

## Module

서버를 이루는 큰 규모의 기능들을 의미합니다. 예를 들어, 어떤 블로그 웹서버는 다음 기능들로 이루어질 수 있습니다.

-   `게시글 관리 모듈`
-   `관리자 기능 모듈`

위의 기능들은 다시 다음과 같이 나눠질 수 있겠죠.

-   `게시글 관리 모듈`

    -   게시글 쓰기 API
    -   게시글 읽기 API
    -   ...

-   `관리자 기능 모듈`
    -   블랙리스트 추가 API
    -   블랙리스트 삭제 API
    -   ...

위에서 볼 수 있듯이, 여러 기능들을 관리하기 쉽게 묶어놓은 객체를 모듈이라고 하며, 각각의 기능들은 `서비스 객체`와 `컨트롤러 객체`가 모여서 이루어집니다. 즉, 최종적으로는 여러개의 `서비스 객체`와 `컨트롤러 객체`가 캡슐화된 것을 모듈이라고 합니다.

```ts
@Module({
    imports: [],
    controllers: [RootController], // 여기에 컨트롤러 객체를 기입
    providers: [RootService], // 여기에 서비스 객체를 기입
})
export class RootModule {}
```

<br/>

추가적으로 `Nest.JS`가 실행될 때 로딩되는 `단 하나의 최상위 모듈`을 `루트 모듈`이라고 부릅니다.

---

## Service

서비스는 `비즈니스 로직`이 포함된 객체이며, 이것을 바꿔말하면 `비즈니스 로직은 서비스에 작성해야 한다`는 것과 같습니다. 아래는 랜덤한 숫자를 생성하는 로직이 포함된 서비스 객체의 예시입니다.

```ts
export class SomethingService {
    getHello(): string {
        return "Hello, World!";
    }

    getRandom(): number {
        return Math.random();
    }
}
```

---

## Controller

컨트롤러는 `클라이언트의 요청을 라우팅`하는 역할을 수행합니다. 다음의 코드는 아래의 경로를 커버하는 컨트롤러 객체의 예시입니다.

-   `[GET] echo/`
-   `[GET] echo/random`

```ts
@Controller("echo")
export class SomethingController {
    @Get()
    getHello(): string {
        return "Hello, World!";
    }

    @Get("/random")
    getRandom(): string {
        return Math.random();
    }
}
```

<br/>

여기서 `getIndex()`와 `getRandom()`는 이미 `Service`에서 구현되었던 내용이므로, 코드중복을 줄이기 위해 서비스를 컨트롤러 안으로 가져오겠습니다.

```ts
@Controller("echo")
export class SomethingController {
    service: SomethingService;
    constructor() {
        this.service = new SomethingService();
    }

    @Get()
    getHello(): string {
        return this.service.getHello();
    }

    @Get("/random")
    getRandom(): string {
        return this.service.getRandom();
    }
}
```

코드중복 문제는 해결된 것 같지만, 디자인 패턴에서의 관점에서 보면 위의 코드는 심각한 결함을 가지고 있습니다. 비즈니스 로직과 컨트롤러의 결합이 매우 강해졌기 때문입니다. `컨트롤러는 사용자의 요청을 라우팅하는 객체`이므로 실제 비즈니스 로직과는 아무런 결합이 없어야 하지만, `생성자에서 서비스 객체를 직접적으로 생성`하고 있는것이 원인입니다. 만약 서비스 객체가 변경되어 `서비스 객체의 생성자에 인자가 추가되었다면` 그 영향은 컨트롤러에도 가게 되겠죠.

---

## Dependency Injection

위의 이슈를 해결하기 위해, 서비스 객체를 컨트롤러 객체에 넣을 때에는 `의존성 주입`을 사용해야 합니다. `Nest.JS`가 각각의 서비스 객체를 미리 만들어두고, `Nest.JS`가 필요한 컨트롤러에 삽입하는 형태입니다. 이러한 형태를 따르면 컨트롤러는 `서비스 객체의 생성자를 직접 부르지 않아도 되기 때문에` 서비스 객체와의 결합도가 크게 떨어졌음을 알 수 있습니다.

<br/>

의존성 주입을 하려면 3가지 준비작업이 필요합니다. 먼저 `Nest.JS`가 서비스 객체를 미리 만들어두도록 해야하기 때문에 서비스 객체에 `@Injectable()` 데코레이터를 붙입니다.

```ts
@Injectable()
export class SomethingService {
    getHello(): string {
        return "Hello, World!";
    }

    getRandom(): number {
        return Math.random();
    }
}
```

모듈 객체의 `Proviers`에 등록합니다. 여기에 등록된 오브젝트는 `Next.JS`가 컨트롤러에 주입할 준비를 합니다.

```ts
@Module({
    imports: [],
    controllers: [EchoController],
    providers: [EchoService],
})
export class EchoModule {}
```

그 뒤에는, 컨트롤러의 생성자에 필드선언만 해두면 됩니다. `Nest.JS`가 해당 타입의 서비스를 주입할 것 입니다.

```ts
@Controller("echo")
export class SomethingController {
    constructor(private readonly service: SomethingService) {}

    @Get()
    getHello(): string {
        return this.service.getHello();
    }

    @Get("/random")
    getRandom(): string {
        return this.service.getRandom();
    }
}
```
