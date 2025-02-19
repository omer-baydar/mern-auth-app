import {createSlice} from "@reduxjs/toolkit"



const initialState={

    isAuthenticated:false,
    accessToken:null,
    role:null

}

const authSlice = createSlice({

    name:"auth",
    initialState:initialState,
    reducers:{

        login:(state,action)=>{

            state.isAuthenticated=true;
            state.accessToken=action.payload.accessToken;
            state.role=action.payload.role;
        },
        logout:(state)=>{

            state.isAuthenticated=false;
            state.accessToken=null;
            state.role=null;

        },
        setAccessToken:(state,action)=>{

            state.accessToken=action.payload.accessToken;

        }

    }


});

export const {login,logout,setAccessToken} = authSlice.actions;

export default authSlice.reducer;
