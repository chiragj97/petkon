import { SET_SELECTED_CUSTOMER_DATA, SET_SELECTED_INVENTORY_DATA, SET_SELECTED_EXPENSE_DATA } from "./action";

const initialState = {
  selectedData: {
    customerData: {},
    inventoryData: {},
    ExpenseData: {},
  },
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_CUSTOMER_DATA:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          customerData: action.payload,
        },
      };
    case SET_SELECTED_INVENTORY_DATA:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          inventoryData: action.payload,
        },
      };
    case SET_SELECTED_EXPENSE_DATA:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          ExpenseData: action.payload,
        },
      };
    default:
      return state;
  }
}
