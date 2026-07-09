import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

    <main className="bg-slate-50">

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-emerald-200">
              Bachelor Nest
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Find Your Perfect Bachelor-Friendly Home
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Bachelor Nest connects students and working professionals with verified landlords and hassle-free
              rental listings.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#properties"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Browse Properties
              </a>
              <Link
                to="/register"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Become a Landlord
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-slate-400">Verified homes</p>
              <p className="mt-3 text-3xl font-bold">Curated</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Listings are designed to help bachelors find homes faster.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-emerald-500 p-6 text-slate-950">
              <p className="text-sm uppercase tracking-wide text-emerald-950/70">Landlord ready</p>
              <p className="mt-3 text-3xl font-bold">Simple</p>
              <p className="mt-2 text-sm leading-6 text-emerald-950/80">
                Add, update, and remove properties with the same dashboard flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="properties" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Available homes</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-950">
              Browse Properties
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Explore current rental options and open property details to learn more.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

    </main>

  );

};

export default Home;
