// // src/components/Breadcrumb.jsx
// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const Breadcrumb = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const paths = location.pathname.split("/").filter(Boolean);

//   // Əgər elan ID-si varsa (məsələn /elan/12)
//   const isPostDetail = paths[0] === "elan" && paths[1];
//   const postId = isPostDetail ? paths[1] : null;

//   // Əgər elan detallındayıqsa, "Geri" funksiyası əvvəlki səhifəyə aparsın
//   const handleBack = () => {
//     if (window.history.state?.idx > 0) {
//       navigate(-2); // əvvəlki səhifəyə qayıt
//     } else {
//       navigate("/"); // əgər tarixdə əvvəlki səhifə yoxdursa ana səhifəyə
//     }
//   };

//   return (
//     <nav className="text-sm text-gray-600 px-4 py-2 flex items-center">
//       <ul className="flex flex-wrap items-center space-x-1">
//         <li>
//           <Link to="/" className="text-blue-600 hover:underline">
//             Ana səhifə
//           </Link>
//         </li>

//         {paths.map((segment, index) => {
//           const path = `/${paths.slice(0, index + 1).join("/")}`;
//           const isLast = index === paths.length - 1;

//           // ID-ləri göstərməyək, əvəzində "Elan detayı" yazılsın
//           const label =
//             segment.match(/^[0-9a-fA-F]+$/) && index > 0
//               ? "Elan detayı"
//               : decodeURIComponent(segment);

//           return (
//             <li key={path} className="flex items-center">
//               <span className="mx-1">{">"}</span>
//               {isLast ? (
//                 <span className="capitalize text-gray-800">{label}</span>
//               ) : (
//                 <Link
//                   to={path}
//                   className="text-blue-600 hover:underline capitalize"
//                 >
//                   {label}
//                 </Link>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       {/* Əgər elan detallındayıqsa, “Geri qayıt” düyməsi göstərilsin */}
//       {isPostDetail && (
//         <button
//           onClick={handleBack}
//           className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
//         >
//           ← Geri qayıt
//         </button>
//       )}
//     </nav>
//   );
// };

// export default Breadcrumb;
