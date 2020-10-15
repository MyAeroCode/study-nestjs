import { IsNumber, IsString } from "class-validator";

export class PayloadDTO {
    @IsString()
    key: string;

    @IsNumber()
    val: number;
}
