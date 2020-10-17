import { Injectable } from "@nestjs/common";

@Injectable()
export class CounterService {
    private val = 0;

    increase(): number {
        return this.val++;
    }

    getValue(): number {
        return this.val;
    }
}
