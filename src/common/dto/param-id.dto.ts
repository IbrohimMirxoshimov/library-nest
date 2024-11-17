import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, Min } from "class-validator";
import { transformToNumber } from "src/utils/transformers";

export class ParamIdDto {
  @ApiProperty({ default: 1 })
  @Transform(transformToNumber)
  @IsInt()
  @Min(1)
  id: number;
}
