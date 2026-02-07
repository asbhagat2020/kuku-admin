const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  isSidebarOpen: false,
  isSearchOpen: false,
};
const navbarSlicer = createSlice({
  name: "navbarSlicer",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      if (state.isSearchOpen) {
        state.isSearchOpen = !state.isSearchOpen;
      }
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearch: (state) => {
      if (state.isSidebarOpen) {
        state.isSidebarOpen = !state.isSidebarOpen;
      }
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeNavbar: (state) => {
      if (state.isSidebarOpen) {
        state.isSidebarOpen = !state.isSidebarOpen;
      }
    },
  },
});

export const { toggleSidebar, toggleSearch, closeNavbar } =
  navbarSlicer.actions;
export default navbarSlicer.reducer;