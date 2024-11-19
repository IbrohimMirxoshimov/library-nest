import { FindAllDto } from 'src/common/dto/find-all.dto';
import { FindAllResponse } from 'src/common/interfaces/crud.interface';

export function getPaginationOptions(dto: FindAllDto) {
  return {
    orderBy: { [dto.order_by || 'updated_at']: dto.order },
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
  };
}

export async function getPaginationResponse<T>(args: {
  count: Promise<number>;
  items: Promise<T[]>;
  dto: FindAllDto;
}): Promise<FindAllResponse<T>> {
  const [total, items] = await Promise.all([args.count, args.items]);

  return {
    total,
    items,
    page: args.dto.page,
  };
}
