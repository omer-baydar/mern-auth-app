import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import axios from "axios";
const apiurl =import.meta.env.VITE_API_BASE_URL;



export const openLoginPopup=()=>{

    const mySwal = withReactContent(Swal);


    return mySwal.fire({
        title:"Giriş Yap",
        html:`<div  style="display:flex; flex-direction:column; gap:20px; padding:10px;">

                <div className="line" style="display:flex; flex-direction:column; gap:10px;"><label style="align-self:start;">Email: </label><input id="input-email" type="email" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>
                <div className="line" style="display:flex; flex-direction:column; gap:10px;"><label style="align-self:start;">Şifre: </label><input id="input-password" type="password" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>


        </div>`,
        showCloseButton:true,
        confirmButtonText:"Giriş Yap",
        customClass:{
            confirmButton:"confirm-button"
        },
        preConfirm:()=>{

            const email = document.getElementById("input-email");
            const password = document.getElementById("input-password");
            return {email:email.value, password:password.value}
        },
    }).then((result)=>{
        if(result.isConfirmed){

            return axios.post(apiurl+"/user/login",{email:result.value.email,password:result.value.password},{withCredentials:true});
            
        }
        else{
            return Promise.reject();
        }
    });

}

export const openRegisterPopup = ()=>{

    const mySwal = withReactContent(Swal);

    return mySwal.fire({
        title:"Kaydol",
        html:`<div style="display:flex; flex-direction:column; gap:20px; padding:10px;">
        <div className="line-container" style="display:flex; gap:20px;">
        <div className="line" style="display:flex; flex-direction:column; gap:10px; width:50%;"><label style="align-self:start;">Ad: </label><input id="input-name" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>
        <div className="line" style="display:flex; flex-direction:column; gap:10px; width:50%;"><label style="align-self:start;">Soyad: </label><input id="input-surname" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding: 10px; outline:none;"/></div>
        </div>
        <div className="line" style="display:flex; flex-direction:column; gap:10px;"><label style="align-self:start;">Email: </label><input id="input-email" type="email" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>
        <div className="line" style="display:flex; flex-direction:column; gap:10px;"><label style="align-self:start;">Şifre: </label><input id="input-password" type="password" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>
        <div className="line" style="display:flex; flex-direction:column; gap:10px;"><label style="align-self:start;">Şifre tekrar: </label><input id="input-passwordagain" type="password" style="border:none; background:#f7f7f7; border-radius:5px; font-size:14px; padding:10px; outline:none;"/></div>
        </div>`,
        confirmButtonText:"Kayıt Ol",
        showCloseButton:true,
        customClass:{
            confirmButton:"confirm-button"
        },
        preConfirm:()=>{

            const name= document.getElementById("input-name").value;
            const surname= document.getElementById("input-surname").value;
            const email= document.getElementById("input-email").value;
            const password= document.getElementById("input-password").value;
            const passwordAgain= document.getElementById("input-passwordagain").value;

            return {name,surname,email,password,passwordAgain};
        }

    }).then((result)=>{

        if(result.isConfirmed){

            return axios.post((apiurl+"/user/register"),result.value,{withCredentials:true});

        }
        else{
            return Promise.reject();
        }
    }
);


    
}

