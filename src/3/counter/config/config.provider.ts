import { Injectable } from "@nestjs/common";

@Injectable()
export class CounterOptionProvider {
    getDefaultValue(): number {
        return 12345;
    }
}
