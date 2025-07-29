import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Order } from "@/types/orders";
import { addOrder, getOrders, updateOrderStatus } from "./orderThunks";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders = [...state.orders, action.payload.data];
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order.id === action.payload.data.id ? action.payload.data : order
        );
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(addOrder.pending, getOrders.pending, updateOrderStatus.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addOrder.rejected,
          getOrders.rejected,
          updateOrderStatus.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || null;
        }
      );
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
