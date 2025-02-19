import store from "../store/store"
import {logout} from "../store/authSlice"

 const withLogout=(E)=>{

    const {auth} = store.getState();

    if(E.key==="logout"){

        if(auth.isAuthenticated===true){

            store.dispatch(logout());

        }

    }
   
}



export {withLogout}