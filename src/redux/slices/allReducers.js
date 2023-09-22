import { combineReducers } from "@reduxjs/toolkit";
import popupSlice from "./popupSlice";
import profileSlice from "./profileSlice";
import sidebarSlice from "./sidebarSlice";
import roomPopup from "./roomPopup";
import menuSlice from "./menuSlice";

export const rootReducer = combineReducers({
	profile: profileSlice,
	sidebar: sidebarSlice,
	popup: popupSlice,
	roomPopup: roomPopup,
	menu:menuSlice
});
