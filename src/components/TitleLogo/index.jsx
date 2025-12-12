import { NavLink } from "react-router-dom";

function TitleLogo() {
  return (
    <div className="title-logo justify-center mt-[-20px]  p-2  flex  items-center   cursor-pointer">
      <NavLink className={`w-[240px] h-[90px]`} to={"/"}>
        
       <img className="w-[240px] h-[90px]" src="/assets/TitleLogoImg/proelan.svg" alt="TezTap" /> 
      </NavLink>

    </div>
  );
}

export default TitleLogo;
