import { Module } from "@nestjs/common";
import { CounterService } from "./counter.service";
import { CounterController } from "./counter.controller";
import { CounterOptionProvider } from "./config/config.provider";

@Module({
    imports: [],
    controllers: [CounterController],
    providers: [
        //
        // 클래스 삽입 문법 (1)
        CounterService,

        //
        // 클래스 삽입 문법 (2)
        // 효과는 위와 같지만, 간단한 동적삽입 가능.
        {
            provide: CounterService,
            useClass: CounterService,
        },

        //
        // 값을 삽입하는 useValue
        {
            provide: "defaultValue",
            useValue: 12345,
        },

        //
        // 좀 더 정교한 방법으로 동적 삽입을 하고 싶다면 useFactory 사용.
        CounterOptionProvider,
        {
            provide: "defaultValue",
            useFactory: (provider: CounterOptionProvider) => {
                return provider.getDefaultValue();
            },

            //
            // Factory에 인젝션해야 할 공급자들.
            // 단, 상위 공급자에 먼저 정의되어 있어야 한다.
            inject: [CounterOptionProvider],
        },
    ],
})
export class CounterModule {}
