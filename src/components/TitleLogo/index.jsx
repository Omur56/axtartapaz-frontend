import { NavLink } from "react-router-dom";



function TitleLogo () {
    return <div className="title-logo p-2 w-[100px] h-[30px] flex  items-center  mb-[0px] cursor-pointer">
       <NavLink className={`w-[100px] h-[30px]`} to={"/"}><p className="flex gap-1 text-white text-[18px] font-bold font-sans"><img className="w-[20px] h-[20px]" src="/assets/TitleLogoImg/axtaricon.png" alt="TezTap" />Omur<span className="text-red-500 font-black text-[18px]">Cars.org</span></p></NavLink>
       
         {/* <img src="/assets/TitleLogoImg/titleLogoAxtar.png" alt="TezTap" /> */}
    </div>;
}

export default TitleLogo;