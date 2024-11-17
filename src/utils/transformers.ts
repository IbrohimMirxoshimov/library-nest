import { TransformFnParams } from 'class-transformer';

export function transformToInt(params: TransformFnParams) {
  if (params.value) {
    return parseInt(params.value);
  }

  return;
}

export function transformToNumber(params: TransformFnParams) {
  if (params.value) {
    return Number(params.value);
  }

  return;
}

export function transformArrayItemsToNumber(params: TransformFnParams) {
  if (Array.isArray(params.value)) {
    return params.value.map(Number);
  }

  return;
}
export function transformToBoolean(params: TransformFnParams) {
  if (params.value) {
    return Boolean(params.value);
  }

  return;
}
