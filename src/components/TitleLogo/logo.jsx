import { NavLink } from "react-router-dom";


function Title_logo() {


  return (
    <div className="flex w-[100px] h-[60px] sm:w-[150px] sm:h-[50px] mt-5 gap-2 items-center">
      <div className="flex w-[15px] bg-black h-[15px] sm:w-[30px] rounded-[50%] sm:h-[30px]  justify-center items-center">
        <div className="w-[5px] h-[5px] sm:w-[10px] sm:h-[10px] bg-white rounded-[50%] justify-center"></div>
      </div>

      <div className="text-[14px] sm:text-[18px] text-black font-semibold">ProElan.az</div>
    </div>
  );
}

export default Title_logo;
