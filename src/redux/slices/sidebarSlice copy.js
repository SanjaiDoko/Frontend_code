import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
    name:'sidebar',
    initialState:{
        sidebarStatus:true,
        currentMenu:'country'
    },
    reducers:{
        closeSidebar : (state) => {
            state.sidebarStatus = false
        },
        openSidebar: (state) => {
            state.sidebarStatus = true
        }
    }
})

export const {closeSidebar , openSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer