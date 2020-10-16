## Providers

실제 `비즈니스 로직`이 담겨진 객체.

---

## Why do we need Providers?

컨트롤러는 요청을 라우팅할 뿐, 그 이상의 역할을 가져서는 안됩니다. 따라서 `비즈니스 로직과 컨트롤러를 분리`하기 위해 공급자가 필요하며, `의존성 주입`의 형태로 컨트롤러에 삽입됩니다. 즉, 공급자는 다른 객체에 주입되어야 하므로 `@Injectable()` 데코레이터와 함께 사용됩니다.

**공급자 :**

```ts
@Injectable()
export class CounterService {
    private val: number = 0;

    count(): number {
        return this.val++;
    }
}
```

**컨트롤러 :**

```ts
@Controller()
export class CounterController {
    constructor(private readonly service: CounterService) {}

    @Get()
    getIndex(): string {
        return "GET /";
    }

    @Get("count")
    getCount(): number {
        return this.service.count();
    }
}
```

---

## Register Into Module

`@Injectable()` 데코레이터가 정의된 공급자 클래스는, `@Module` 데코레이터의 `providers` 프로퍼티에 등록될 수 있습니다.

```ts
@Module({
    ...,
    providers: [CounterService],
})
export class CounterModule {}
```

내부적으로 `providers`는 `Key`와 `Val`의 배열입니다. 위의 코드는 `useClass`를 사용하여 고쳐쓸 수 있습니다. 이 문법과 삼항 연산자를 같이 사용하면 사용할 서비스를 동적으로 선택할 수 있습니다.

```ts
@Module({
    ...,
    providers: [{
        provide : CounterService,
        useClass : CounterService
    }],
})
export class CounterModule {}
```

동적으로 선택할 조건이 까다롭다면 `useFactory`에 `Injectable 객체를 반환하는 함수`를 전달하세요.

```ts
@Module({
    ...,
    providers: [{
        provide : "service",
        useClass : () => {
            return new CounterSeivce();
        }
    }],
})
export class CounterModule {}
```

팩토리 함수에 인자가 필요하다면 `inject` 파라미터를 같이 사용하면 됩니다. 단, 여기에 적히는 것도 `Injectable 객체` 이어야 하고, 상위 `provider`에 먼저 등록되어 있어야 합니다.

```ts
@Injectable()
class CounterParams {
    defaultValue : number = 12345;
}

@Module({
    ...,
    providers: [
        //
        // useFactory에 사용되기 전에 미리 선언.
        CounterParams,

        //
        // useFactory에 CounterParams 주입.
        {
            provide : "service",
            useClass : (params : CounterParams) => {
                const { defaultValue } = params;
                ...
            },
            inject : [CounterParams]
        }
    ],
})
export class CounterModule {}
```

마지막으로 정적인 값이나 객체를 넘기려면 `useValue`를 사용합니다.

```ts
@Module({
    ...,
    providers: [{
        provide : "defaultValue",
        useValue : 12345
    }],
})
export class CounterModule {}
```

---

## Injection Scope

`@Injectable` 객체의 주입 시기는 `scope` 옵션에 의해 결정됩니다.

-   `Scope.DEFAULT` : 서버 생성시 최초 1회만 생성하고 싱글톤으로 사용.
-   `Scope.REQUEST` : 매 요청마다 새로운 객체 생성.

즉, 다음 코드는 매 요청마다 새로운 카운터 객체가 생성되므로, `localhost:3000/count`에 출력되는 값이 0에서 변하지 않습니다.

```ts
@Injectable({ scope: Scope.DEFAULT })
export class CounterService {
    private val: number = 0;

    count(): number {
        return this.val++;
    }
}

@Controller()
export class CounterController {
    constructor(private readonly service: CounterService) {}

    @Get()
    getIndex(): string {
        return "GET /";
    }

    @Get("count")
    getCount(): number {
        return this.service.count();
    }
}
```

---

## Property Injection

기본적으로는 `생성자 기반 인젝션`을 추천하지만, `@Injectable` 객체의 생성자가 여러번 상속되어 복잡해질 경우 `Property Inectjion` 방식을 사용할 수 있습니다.

```ts
@Injectable({ scope: Scope.DEFAULT })
export class CounterService {
    //
    // 프로퍼티 기반 인젝션
    @Inject("defaultValue")
    private val: number;

    //
    // 생성자 기반 인젝션
    constructor(@Inject("defaultValue") private val: number) {
        console.log("New Counter Service Instance Created.");
    }
}
```
