import { NavLink } from "react-router-dom";

function TitleLogo() {
  return (
    <div className="title-logo justify-center mt-[-20px]  p-2  flex  items-center   cursor-pointer">
      <NavLink className={`w-[80px] h-[30px] flex `} to={"/"}>
        <div className=" flex justify-center items-center gap-1">
          <img
            className="w-[40px] h-[30px] bg-gradient-to-r from-pink-600 to-violet-600 via-indigo-500 to-blue-400 border rounded-[10px]"
            src="/assets/TitleLogoImg/search_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"
            alt="ProElan"
          />
          <span className="text-black font-bold text-2xl tracking-wide drop-shadow-md hover:text-green-500 transition-colors duration-300">
            ProElan.az
          </span>
        </div>

        {/* <img className="w-[40px] h-[30px]" src="/assets/TitleLogoImg/proelan.svg" alt="TezTap" />  */}
      </NavLink>
    </div>
  );
}

export default TitleLogo;
