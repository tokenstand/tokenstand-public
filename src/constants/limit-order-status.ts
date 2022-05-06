export enum LimitOrderStatusEnum {
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  PARTIAL_FILLED = 'partial_filled',
  EXECUTING = 'executing',
}

export const LimitOrderStatusLabels = {
  [LimitOrderStatusEnum.COMPLETED]: 'Completed',
  [LimitOrderStatusEnum.CANCELED]: 'Canceled',
  [LimitOrderStatusEnum.PARTIAL_FILLED]: 'Partial filled',
  [LimitOrderStatusEnum.EXECUTING]: 'Executing',
};
