import {Outlet,Navigate,useLocation} from "react-router-dom"
import react,{useEffect} from "react"
import {useSelector,useDispatch} from "react-redux"
import {toast} from "react-toastify"

const ProtectedRoute =()=>{


    const isAuthenticated = useSelector((state)=>{return state.auth.isAuthenticated});

    useEffect(()=>{

        if(!isAuthenticated){
            toast.error("Lütfen bu sayfaya devam edebilmek için giriş yapın");
        }

    },[]);

   

return (
    <div style={{flex:1}}>

        {isAuthenticated?<Outlet/>:<Navigate to="/"/>}

    </div>
)

}

export default ProtectedRoute