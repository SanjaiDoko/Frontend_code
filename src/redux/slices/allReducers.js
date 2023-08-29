import { combineReducers } from "@reduxjs/toolkit";
import popupSlice from "./popupSlice";
import profileSlice from "./profileSlice";
import sidebarSlice from "./sidebarSlice";

export const rootReducer = combineReducers({
	profile: profileSlice,
	sidebar: sidebarSlice,
	popup: popupSlice,
});
