import { Inject, Injectable, Scope } from "@nestjs/common";

//
// 인젝션 스코프
//      Scope.DEFAULT   : 서버 생성시에 하나만 생성하여 싱글톤으로 사용. (쉬운 데이터 공유)
//      Scope.REQUEST   : 요청 생성시마다 생성. (데이터 공유가 어렵고, 성능상 불이익 있음)
@Injectable({ scope: Scope.DEFAULT })
export class CounterService {
    //
    // 프로퍼티 기반 인젝션
    @Inject("defaultValue")
    private _val: number;

    //
    // 생성자 기반 인젝션
    constructor(@Inject("defaultValue") private val: number) {
        console.log("New Counter Service Instance Created.");
    }

    count(): number {
        //
        // Scope.DEFAULT : 12345에서 시작하여 하나씩 올라감.
        // Scope.REQUEST : 12345에서 변하지 않음.
        return this.val++;
    }
}
