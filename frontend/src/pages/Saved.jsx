import { useEffect, useState } from "react";
import API from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const Saved = () => {

  const [properties, setProperties] = useState([]);

  useEffect(() => {

    const fetchSaved = async () => {

      try {

        const res = await API.get("/users/saved-properties");

        setProperties(res.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchSaved();

  }, []);

  const handleRemove = async (id) => {

    try {

      await API.delete(`/properties/${id}/save`);

      setProperties((currentProperties) => (
        currentProperties.filter(p => p._id !== id)
      ));

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Saved Properties ❤️
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {properties.length === 0 ? (
          <p>No saved properties</p>
        ) : (
          properties.map((property) => (
            <div key={property._id}>

              <PropertyCard property={property} />

              <button
                onClick={() => handleRemove(property._id)}
                className="bg-red-500 text-white px-3 py-1 mt-2 rounded w-full"
              >
                Remove ❌
              </button>

            </div>
          ))
        )}

      </div>

    </div>

  );

};

export default Saved;
