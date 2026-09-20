import React from "react";
import { NavLink } from "react-router-dom";

function Title_logo() {
  return (
    <NavLink
      to="/"
      aria-label="ProElan.az ana səhifə"
      className="
        group
        flex
        items-center
        gap-2.5
        shrink-0
        no-underline
        select-none
        mt-0
      "
    >
      {/* LOGO ICON */}
      <div
        className="
          relative
          flex
          w-9
          h-9
          sm:w-10
          sm:h-10
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-br
          from-green-400
          via-emerald-500
          to-green-600
          shadow-md
          shadow-green-500/20
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:rotate-2
          group-hover:shadow-lg
          group-hover:shadow-green-500/30
        "
      >
        {/* INNER CIRCLE */}
        <div
          className="
            w-3.5
            h-3.5
            sm:w-4
            sm:h-4
            rounded-full
            bg-white
            shadow-sm
          "
        />

        {/* SMALL DOT */}
        <div
          className="
            absolute
            w-1.5
            h-1.5
            sm:w-2
            sm:h-2
            rounded-full
            bg-green-500
          "
        />
      </div>

      {/* LOGO TEXT */}
      <div className="flex items-baseline leading-none">
        <span
          className="
            text-[17px]
            sm:text-[21px]
            font-extrabold
            tracking-tight
            text-red-500
            transition-all
            duration-300
            group-hover:text-red-600
          "
        >
          ProElan
        </span>

        <span
          className="
            text-[17px]
            sm:text-[21px]
            font-extrabold
            tracking-tight
            text-slate-800
            dark:text-white
            transition-colors
            duration-300
          "
        >
          .az
        </span>
      </div>
    </NavLink>
  );
}

export default Title_logo;
