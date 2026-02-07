import {
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/Notification/Notification";
import axios from "axios";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
import Cookies from "js-cookie";

const initialState = {
  product: [],
  pendingProducts: [],
  isLoading: false,
  error: null,
};

export const getProducts = createAsyncThunk("getProducts", async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/admin`
    );
    return response.data;
  } catch (error) {
    showErrorNotification("product", "Failed to fetch products", 5000);
    throw error;
  }
});

export const getPendingProducts = createAsyncThunk("getPendingProducts", async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/pending`
    );
    return response.data.products;
  } catch (error) {
    showErrorNotification("product", "Failed to fetch products", 5000);
    throw error;
  }
});

export const deleteProduct = createAsyncThunk("deleteProduct", async ({ productId }) => {
  try {
    const token = JSON.parse(Cookies.get("token"));
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/admin-product/delete/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      showSuccessNotification("product", "Product deleted successfully", 5000);
      return productId;
    } else {
      throw new Error(response.data?.message || "Failed to delete product");
    }
  } catch (error) {
    showErrorNotification("product", "Failed to delete product", 5000);
    throw error;
  }
});

export const editProduct = createAsyncThunk("editProduct", async ({ productId, productData }) => {
  try {
    const token = JSON.parse(Cookies.get("token"));
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/edit/${productId}`,
      productData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showSuccessNotification("product", "Product updated successfully", 5000);
    return response.data;
  } catch (error) {
    showErrorNotification("product", "Failed to update product", 5000);
    throw error;
  }
});

// export const addProduct = createAsyncThunk("addProduct", async (productData) => {
//   try {
//     const token = JSON.parse(Cookies.get("token"));
//     console.log("token...................", token);
    
//     // Log product data before the request
//     console.log("product data", productData);
    
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product/add`,
//       productData,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
    
//     showSuccessNotification("product", "Product added successfully", 5000);
//     return response.data.product;
//   } catch (error) {
//     showErrorNotification("product", "Failed to add product", 5000);
//     throw error;
//   }
// });

export const addProduct = createAsyncThunk("addProduct", async (productData) => {
  try {
    const token = JSON.parse(Cookies.get("token"));
    console.log("token...................", token);
    
    // Log product data before the request
    console.log("product data", productData);
    
    // The issue is likely here - you might be sending nested data
    // Make sure you're sending the actual product data, not wrapped in another object
    const dataToSend = productData.productData || productData;
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product/add`,
      dataToSend,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    showSuccessNotification("product", "Product added successfully", 5000);
    return response.data.product;
  } catch (error) {
    console.error("Save error:", error);
    showErrorNotification("product", "Failed to add product", 5000);
    throw error;
  }
});

const productSlicer = createSlice({
  name: "productSlicer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(getPendingProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPendingProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pendingProducts = action.payload;
    });
    builder.addCase(getPendingProducts.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = state.product.filter((product) => product._id !== action.payload);
    });
    builder.addCase(deleteProduct.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(editProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = state.product.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    });
    builder.addCase(editProduct.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = [...state.product, action.payload];
    });
    builder.addCase(addProduct.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export default productSlicer.reducer;
