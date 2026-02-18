import { NavLink } from "react-router-dom";


function TitleLogo() {
  return (
    <div className="title-logo justify-center mt-[-20px]  p-2  flex  items-center   cursor-pointer">
      <NavLink className={`w-[80px] h-[50px] flex `} to={"/"}>
        <div className=" flex justify-center items-center gap-1">
          <img
          
            className="w-[80px] h-[50px] "
            src="/assets/TitleLogoImg/logo-minimal.svg"
            alt="ProElan"
          />
          {/* <span className="text-green-500 font-normal text-2xl tracking-wide drop-shadow-md hover:text-green-500 transition-colors duration-300">
            ProElan.az
          </span> */}
        </div>

        {/* <img className="w-[40px] h-[30px]" src="/assets/TitleLogoImg/proelan.svg" alt="TezTap" />  */}
      </NavLink>
    </div>
  );
}

export default TitleLogo;
