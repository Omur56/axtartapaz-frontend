import { NavLink } from "react-router-dom";

function TitleLogo() {
  return (
    <div className="title-logo justify-center mt-[-10px]  p-2 w-[100px] h-[30px] flex  items-center   cursor-pointer">
      <NavLink className={`w-[100px] h-[30px]`} to={"/"}>
        <p className="flex gap-1 text-red-500 text-[18px] font-bold font-sans">
          
          Omur
          <span className="text-red-500 font-bold  text-[18px]">Cars.org</span>
        </p>
      </NavLink>

      {/* <img src="/assets/TitleLogoImg/titleLogoAxtar.png" alt="TezTap" /> */}
    </div>
  );
}

export default TitleLogo;
