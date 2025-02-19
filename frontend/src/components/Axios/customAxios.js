import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

import store from "../../store/store"
import {setAccessToken,logout} from "../../store/authSlice"

const customAxios = axios.create({timeout:10000,baseURL:apiUrl,withCredentials:true});

let requestQueue=[];
let isRefreshing=false;

customAxios.interceptors.request.use((config)=>{


   if(!isRefreshing){

    const {auth} =store.getState();

    

    if(auth.accessToken){

        config.headers.Authorization="Bearer "+auth.accessToken;
        

    }

    return Promise.resolve(config);

   }
   else{

        return new Promise((resolve,reject)=>{

            requestQueue.push({resolve,reject,config});
        });
   }
},(err)=>{return Promise.reject(err)});



customAxios.interceptors.response.use((response)=>{

    return response;

},async (err)=>{

    if(err.response && err.response.status===401 && !err.config._retry){

        try{

            isRefreshing=true;

            const response = await axios.post(apiUrl+"/auth/refresh",{},{withCredentials:true});

            if(response.data.success){

                store.dispatch(setAccessToken({accessToken:response.data.accessToken}));

                err.config._retry=true

                isRefreshing=false;

                const response = customAxios.request(err.config);

                requestQueue.forEach(({resolve,reject,config})=>{

                    config.headers.Authorization="Bearer " + response.data.accessToken;

                    config._retry=true;

                    resolve(config);

                });


                requestQueue=[];


                return response;

            }
            else{

                requestQueue.forEach(({resolve,reject,config})=>{

                    reject();

                });

                store.dispatch(logout());

                requestQueue=[];
                isRefreshing=false;


                return Promise.reject(err);

            }

        }
        catch(error){

            requestQueue.forEach(({resolve,reject,config})=>{

                reject(error);

            });

            store.dispatch(logout());

            requestQueue=[];
            isRefreshing=false;

            return Promise.reject(err);
        }

        

    }
    else{
        return Promise.reject(err);
    }

});

export default customAxios;