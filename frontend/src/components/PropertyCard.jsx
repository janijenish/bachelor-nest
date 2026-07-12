import { useNavigate } from "react-router-dom";
import { applyImageFallback, PROPERTY_IMAGE_FALLBACK } from "../utils/imageFallback";

const PropertyCard = ({ property }) => {

  const navigate = useNavigate();

  return (

    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="relative">
        <img
          src={property.image || PROPERTY_IMAGE_FALLBACK}
          alt={property.title}
          className="h-52 w-full object-cover"
          onError={applyImageFallback}
        />
      </div>

      <div className="space-y-4 p-4">

        <div>
          <h2 className="line-clamp-1 text-lg font-bold text-slate-950">
            {property.title}
          </h2>

          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
            {property.location}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Monthly rent
            </p>
            <p className="text-xl font-bold text-emerald-600">
              Rs. {property.price}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/property/${property._id}`)}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View
          </button>

        </div>

      </div>

    </article>

  );

};

export default PropertyCard;
