import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSave = async () => {
    try {
      await API.post(`/properties/${property._id}/save`);
      alert("Saved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save property");
    }
  };

  if (loading) {
    return <p className="p-6 text-lg">Loading...</p>;
  }

  if (!property) {
    return <p className="p-6 text-lg">Property not found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={property.image || "https://via.placeholder.com/900x500?text=Property"}
          alt={property.title}
          className="h-80 w-full object-cover"
        />

        <div className="space-y-4 p-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">{property.title}</h1>
            <p className="mt-2 text-slate-600">{property.location}</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">Rs. {property.price}</p>
          </div>

          <p className="leading-7 text-slate-700">{property.description}</p>

          <div className="flex flex-wrap gap-3">
            {property.furnishing && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {property.furnishing}
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            className="rounded-full bg-pink-500 px-4 py-2 text-white transition hover:bg-pink-600"
          >
            Save Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
