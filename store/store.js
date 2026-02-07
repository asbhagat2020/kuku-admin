import { configureStore } from "@reduxjs/toolkit";
import navbarSlicer from "./Navbar/navbarSlicer";
import loginSlicer from "./Login/LoginSlicer";
import productsSlicerReducer from "./Products/productSlicer.reducer";

export const store = configureStore({
  reducer: {
    navbar: navbarSlicer,
    otp: loginSlicer,
    product: productsSlicerReducer,
  },
});
