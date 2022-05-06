import { createReducer } from "@reduxjs/toolkit";
import {
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setFromBentoBalance,
  setLimitOrderApprovalPending,
  setLimitPrice,
  setOrderExpiration,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";

export enum OrderExpiration {
  never = "never",
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
}

export interface LimitOrderState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly limitPrice: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null;
  readonly fromBentoBalance: boolean;
  readonly limitOrderApprovalPending: string;
  readonly orderExpiration: {
    value: OrderExpiration | string;
    label: string;
  };
}

const initialState: LimitOrderState = {
  independentField: Field.INPUT,
  typedValue: "",
  limitPrice: "",
  [Field.INPUT]: {
    currencyId: "",
  },
  [Field.OUTPUT]: {
    currencyId: "",
  },
  recipient: null,
  fromBentoBalance: false,
  limitOrderApprovalPending: "",
  orderExpiration: {
    value: "",
    label: "",
  },
};
export const defaultOuput = [
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
  "0xd35d2e839d888d1cdbadef7de118b87dfefed20e",
];
export default createReducer<LimitOrderState>(initialState, (builder) =>
  builder
    .addCase(
      replaceLimitOrderState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            independentField,
            inputCurrencyId,
            outputCurrencyId,
            fromBentoBalance,
            limitPrice,
            orderExpiration,
          },
        }
      ) => ({
        [Field.INPUT]: {
          currencyId: inputCurrencyId,
        },
        [Field.OUTPUT]: {
          currencyId: outputCurrencyId,
        },
        independentField,
        typedValue: typedValue,
        recipient,
        fromBentoBalance,
        limitPrice,
        orderExpiration,
        limitOrderApprovalPending: state.limitOrderApprovalPending,
      })
    )
    .addCase(setLimitPrice, (state, { payload: limitPrice }) => {
      state.limitPrice = limitPrice;
    })
    .addCase(
      setLimitOrderApprovalPending,
      (state, { payload: limitOrderApprovalPending }) => {
        state.limitOrderApprovalPending = limitOrderApprovalPending;
      }
    )
    .addCase(setOrderExpiration, (state, { payload: orderExpiration }) => {
      state.orderExpiration = orderExpiration;
    })
    .addCase(setFromBentoBalance, (state, { payload: fromBentoBalance }) => {
      state.fromBentoBalance = fromBentoBalance;
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;

      if (
        currencyId === state[otherField].currencyId ||
        ((state[Field.INPUT].currencyId ==
          "ETH" ||'BNB')&&
          (state[otherField].currencyId == "")&& defaultOuput.includes(currencyId.toLowerCase()))
      ) {

        return {
          ...state,
          independentField:
            state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        };
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        limitPrice:
          +state.limitPrice > 0 ? (1 / +state.limitPrice).toString() : "0.0",
        independentField:
          state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient;
    })
);
