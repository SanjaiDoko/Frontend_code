import React from "react";
import { ReactComponent as LoaderSvg } from "../../assets/Images/loader.svg";

export default function Loader(){
    return(
        <div className="loaderContainer" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
            <LoaderSvg />
        </div>
    )
}
