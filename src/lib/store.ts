import {
  combineReducers,
  combineSlices,
  configureStore,
} from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";
import categoryReducer from "./features/category/categorySlice";
import brandReducer from "./features/brand/brandSlice";
import orderReducer from "./features/order/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  cart: cartReducer,
  product: productReducer,
  category: categoryReducer,
  brand: brandReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
