import { FindOneDto } from "src/common/dto/common.dto";
import { FindAllDto } from "src/common/dto/find-all.dto";

export interface ICrudService<T> {
  create(dto: unknown, ...rest: unknown[]): Promise<T | void>;
  update(dto: FindOneDto, data: unknown): Promise<T | null | void>;
  findAll(dto: FindAllDto): Promise<FindAllResponse<T>>;
  findOne(dto: FindOneDto): Promise<T | null>;
}

export interface FindAllResponse<T, M = unknown> {
  items: T[];
  page: number;
  total: number;
  message?: string;
  meta?: M;
}
