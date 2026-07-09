import { useEffect, useState } from "react";
import API from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const Home = () => {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProperties = async () => {

      try {

        const res = await API.get("/properties");

        setProperties(res.data.properties || res.data);

        setLoading(false);

      } catch (error) {
        console.error(error);
      }

    };

    fetchProperties();

  }, []);

  if (loading) {
  return <p className="p-6 text-lg">Loading properties...</p>;
}


  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Available Properties
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}

      </div>

    </div>

  );

};

export default Home;