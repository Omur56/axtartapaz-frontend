import axios from "axios";


function ListingCard({ listing }) {

  const handleUpgrade = async (listingId, type) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/payments/create-checkout/${listingId}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      window.location.href = res.data.url;

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border p-4 rounded">

      <img src={listing.images?.[0]} alt="" />
      <h2>{listing.title}</h2>
      <p>{listing.price} AZN</p>

      {/* 👇 BUTTONLAR BURADA */}

      <div className="flex gap-2 mt-3">

        <button
          onClick={() => handleUpgrade(listing._id, "premium")}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Premium et
        </button>

        <button
          onClick={() => handleUpgrade(listing._id, "vip")}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          VIP et
        </button>

      </div>

    </div>
  );
}

export default ListingCard;