import { Controller, Get } from "@nestjs/common";
import { CounterService } from "./counter.service";

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
