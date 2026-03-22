import { NavLink } from "react-router-dom";

function Title_logo() {
  return (
    <div className="flex w-[150px] h-[50px] mt-5 gap-2 items-center">
      <div className="flex w-[30px] bg-black h-[30px] rounded-[50%] justify-center items-center">
        <div className="w-[10px] h-[10px] bg-white rounded-[50%] justify-center"></div>
      </div>

      <div className="text-[18px] text-black font-semibold">ProElan.az</div>
    </div>
  );
}

export default Title_logo;
