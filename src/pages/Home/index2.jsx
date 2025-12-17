// {[...cars].map((car) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={car.id}
//                         to={`/cars/${car._id}`}
//                       >
//                         <div className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300">
//                           <div className="w-[185.7px] h-[229.6px] sm:w-[268.75px] sm:h-[268.6px] max-w-[240.4px] max-h-[150px] rounded-t-[8px] relative">
//                             {car.salon && (
//                               <p className="absolute top-[125px] z-50 left-2 bg-indigo-500 text-white text-[10px] font-500 p-1 rounded">
//                                 {car.salon}
//                               </p>
//                             )}
//                             <div className="flex justify-between z-50 gap-2">
//                               <div className="absolute mt-1 w-full p-1 z-50 top-0 left-0 flex gap-2">
//                                 {car.kredit && (
//                                   <p className="w-[25px] bg-orange-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
//                                     {" "}
//                                     <Percent
//                                       size={16}
//                                       strokeWidth={1.5}
//                                       absoluteStrokeWidth
//                                     />{" "}
//                                   </p>
//                                 )}
//                                 {car.barter && (
//                                   <p className="w-[25px] bg-green-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
//                                     <RefreshCcw
//                                       size={16}
//                                       strokeWidth={1.5}
//                                       absoluteStrokeWidth
//                                     />
//                                   </p>
//                                 )}
//                                 {/* <p>{options.kredit && options.barter }</p> */}
//                               </div>
//                             </div>

//                             <img
//                                src={car.mainImage || car.images[0]}
//   alt={car.brand}
//                               className="absolute top-0 left-0 w-full h-full object-cover rounded-t-[8px]"
//                             />
//                           </div>
//                           <div className="p-2 ">
//                             <h3 className="text-[12px] font-bold font-black text-black">
//                               {car.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] truncate w-30">
//                               {car.category}, {car.brand}, {car.model}
//                             </h2>
//                             <p className="text-gray-600 truncate w-30">
//                               {car.year},{car.motor} {car.km} km
//                             </p>
//                             <div className="flex justify-between gap-1 mt-7 ">
//                               <p className="text-[10px] p-1 rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {car.location}
//                               </p>
//                               <p className="capitalize text-[12px] p-1 rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(car.data)}{" "}
//                                 {getCurrentTime(car.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <div className=" mt-1 w-full p-1 z-50 top-1 left-1 flex gap-2">
//                         <button
//                           onClick={() => toggleFavorite(car)}
//                           className={`absolute   top-1 right-1 p-[2px] rounded-full`}
//                         >
//                           <Heart
//                             fill={
//                               favorites.find((fav) => fav._id === car._id)
//                                 ? "red"
//                                 : "none"
//                             }
//                             size={24}
//                             color="#ffffff"
//                             strokeWidth={1.75}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   {[...homeGarden].map((post) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={post._id}
//                         to={`/elan/${post._id}`}
//                       >
//                         <div
//                           key={post._id}
//                           className="w-[185.7px] h-[222.w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               post.images && post.images.length > 0
//                                 ? post.images[0].startsWith("http")
//                                   ? post.images[0]
//                                   : `${process.env.REACT_APP_API_URL}/uploads/${post.images[0]}`
//                                 : "/no-image.jpg"
//                             }
//                             alt={post.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-[12px] font-bold text-black truncate w-30 ">
//                               {post.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {post.title}
//                             </h2>

//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {post.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(post.data)}{" "}
//                                 {getCurrentTime(post.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(post)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === post._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...elektronikaPost].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostDetailElectronika/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="w-[185.7px] h-[222.6w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-xl font-bold text-black">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.category}
//                             </h2>
//                             <h3 className="text-[12px] font-semibold truncate w-30">
//                               {item.title}
//                             </h3>
//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...accessories].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostDetailAcsesuar/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="w-[185.7px] h-[222.6pw-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-[12px] font-bold text-black">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.category}
//                             </h2>
//                             <h3 className="text-[12px] font-semibold truncate w-30">
//                               {item.title}
//                             </h3>
//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...realEstate].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostRealEstate/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-[12px] font-bold text-black">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.title_type}, {item.type_building},{" "}
//                               {item.location}
//                             </h2>

//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "none"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...Household].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostDetailHousehold/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-[12px] font-bold text-black truncate w-30">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.title}, {item.category}, {item.location}
//                             </h2>

//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px]  rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...Phone].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostDetailPhone/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="ww-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-xl font-bold text-black">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.title}, {item.brand}, {item.model}
//                             </h2>
//                             <h3 className="text-[12px] font-semibold truncate w-30"></h3>
//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}

//                   {[...Clothing].reverse().map((item) => (
//                     <div className="relative">
//                       <Link
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         key={item._id}
//                         to={`/PostDetailClothing/${item._id}`}
//                       >
//                         <div
//                           key={item._id}
//                           className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
//                         >
//                           <img
//                             src={
//                               item.images?.[0]?.startsWith("http")
//                                 ? item.images[0]
//                                 : "/no-image.jpg"
//                             }
//                             alt={item.title}
//                             className="w-full h-[147px] object-cover rounded-t-[8px]"
//                           />
//                           <div className="p-4">
//                             <h3 className="text-xl font-bold text-black">
//                               {item.price} AZN ₼
//                             </h3>
//                             <h2 className="text-[12px] font-bold truncate w-30">
//                               {item.title}, {item.brand}, {item.model}
//                             </h2>
//                             <h3 className="text-[12px] font-semibold truncate w-30"></h3>
//                             <div className="flex justify-between gap-1 mt-8 ">
//                               <p className="text-[10px] rounded flex justify-between text-gray-600">
//                                 <MapPin size={12} color="#75FC56" />{" "}
//                                 {item.location}
//                               </p>
//                               <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
//                                 {formatDate(item.data)}{" "}
//                                 {getCurrentTime(item.data)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         onClick={() => toggleFavorite(item)}
//                         className={`absolute top-1 right-1 p-[2px] rounded-full `}
//                       >
//                         <Heart
//                           fill={
//                             favorites.find((fav) => fav._id === item._id)
//                               ? "red"
//                               : "#cccccc"
//                           }
//                           size={24}
//                           color="#ffffff"
//                           strokeWidth={1.75}
//                         />
//                       </button>
//                     </div>
//                   ))}