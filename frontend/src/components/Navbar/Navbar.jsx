import react from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import "./Navbar.css"
import { openLoginPopup,openRegisterPopup } from "../Popup/AuthModal"
import axios from "axios"
import {toast} from "react-toastify"
import {useSelector,useDispatch} from "react-redux";
import {login as reduxLogin,logout as reduxLogout} from "../../store/authSlice"
import customAxios from "../Axios/customAxios"
import {useNavigate,Link} from "react-router-dom";
const Navbar =()=>{

    const isAuthenticated = useSelector((state)=> state?.auth?.isAuthenticated);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const login =()=>{

      openLoginPopup().then((response)=>{
        
        dispatch(reduxLogin({accessToken:response.data.accessToken,role:response.data.role}));

        toast.success("Başarıyla giriş yapıldı");

        navigate("/");
      }).catch((err)=>{
        console.log(err);
        if(err?.response.data?.errorType==="ValidationError"){
            toast.error("Lütfen tüm alanları geçerli değerlerle doldurunuz");
        }
        else if(err?.response.data?.errorType==="AuthenticationError"){
            toast.error("Email veya şifre hatalı");
        }
        else if(err?.response.data?.errorType==="UnknownError"){

            toast.error("İşleminiz sırasında bilinmeyen bir hata oluştu");
        }
      })


    }
   
    const register =()=>{

        openRegisterPopup().then((response)=>{

            if(response.data.success){
                toast.success("Kaydınız başarıyla gerçekleşti");

                navigate("/");
            }
            else{
                toast.error("Kayıt sırasında hata oluştu");
            }
        }).catch((err)=>{

            console.log(err);
            if(err?.response.data?.errorType==="ValidationError"){
                toast.error(err.response.data?.message);
            }
            else if(err?.response.data?.errorType==="DuplicatedKeyError"){

                toast.error("Bu email adresi zaten bir hesaba bağlı");

            }
            else if(err?.response.data?.errorType==="UnknownError"){

                toast.error("İşleminiz sırasında bilinmeyen bir hata oluştu");
            }


        });

    }
    
    const logout=async()=>{

        try{

            const response = await customAxios.post("/user/logout",{});

            if(response.data.success){

                navigate("/");
                dispatch(reduxLogout());
                localStorage.setItem("logout",Date.now());
                toast.success("Başarıyla çıkış yapıldı");
                
            }
            

        }
        catch(err){
            console.log(err);
        }
       
    }

    return(
        <div style={{flexShrink:0}} className="navbar">
        <div className="container">
        <div className="main-area">
        <div className="left"  >LOGO</div>
        <div className="center" >
        <Link className="link" to="/">Anasayfa</Link>
        <Link className="link" to="/anotherpage">Diğer Sayfa</Link>
        </div>
        <div className="right" style={{}}>

        {
                    isAuthenticated?<button onClick={()=>{logout()}}>Çıkış Yap</button>:           
                    (<div className="button-container">
                    <button onClick={()=>{login()}}>Giriş Yap</button>
                    <button onClick={()=>{register()}}>Kayıt Ol</button>
                    </div>)

                }
                

        </div>
                
        </div>
        </div>
        </div>
    )

}

export default Navbar