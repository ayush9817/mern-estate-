import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    errors : null,
    loading : false
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers : {
         signInStart: (state)=>{
            state.loading = false;
         },
         signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.errors = null;
         },
         signInFailure:(state,action)=>{
            state.loading = false;
            state.errors = action.payload;
         },
         updateUserStart : (state)=>{
            state.loading = false;
         },
         updateUserSuccess : (state,action)=>{
             state.currentUser = action.payload;
             state.loading = false;
             state.errors = null;
         },
         updateUserFailure : (state,action)=>{
                  state.errors = action.payload;
                  state.loading = false;
         },
         deleteUserStart : (state)=>{
                  state.loading = true;
         },
         deleteUserSuccess : (state)=>{
                  state.currentUser = null;
                  state.loading = false;
                  state.errors = null;
         },
         deleteUserFailure : (state,action)=>{
            state.errors = action.payload;
            state.loading = false;
         }
    }
}
)

export const  {signInFailure,signInStart,signInSuccess , updateUserStart , updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure} = userSlice.actions;
export default userSlice.reducer;
