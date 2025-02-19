import react,{useEffect,useState} from "react"
import axios from "axios"
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import {Outlet} from "react-router-dom"
import {useDispatch} from "react-redux"
import Spinner from "../Spinner/Spinner.jsx"
import {login} from "../../store/authSlice.js"

const PersistLogin =()=>{

    const dispatch = useDispatch();


    const [isLoading,setisLoading] = useState(true);

    const persistLogin=async()=>{

        setisLoading(true);

        try{

            const response = await  axios.post(apiUrl+"/auth/refresh",{},{withCredentials:true});

            if(response.data.success){

                dispatch(login({accessToken:response.data.accessToken,role:response.data.role}));

            }
            else{

            }

        }
        catch(err){

        }
        finally{
            setisLoading(false);
        }
       

    }

    useEffect(()=>{

        persistLogin();

    },[]);

    return(
        <div style={{display:"flex", flex:1}}>

        {isLoading?<Spinner/>:< Outlet/>}

        </div>
    )
}

export default PersistLogin