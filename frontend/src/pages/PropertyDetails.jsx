import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { getStoredUser } from "../api/axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const currentUser = getStoredUser();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactDetails, setContactDetails] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load this property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSave = async () => {
    if (!property?._id) {
      return;
    }

    try {
      setSaving(true);
      await API.post(`/properties/${property._id}/save`);
      alert("Property saved successfully");
    } catch (saveError) {
      alert(saveError.response?.data?.message || "Unable to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleGetContactDetails = async () => {
    if (!property?._id) {
      return;
    }

    try {
      setContactLoading(true);
      setContactError("");

      const res = await API.get(`/properties/${property._id}/contact-details`);
      setContactDetails(res.data?.landlord || null);
    } catch (contactFetchError) {
      setContactError(
        contactFetchError.response?.data?.message || "Unable to load landlord contact details"
      );
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Loading property details...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
          {error || "Property not found"}
        </div>
      </main>
    );
  }

  const isTenant = currentUser?.role === "tenant";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={property.image || "https://via.placeholder.com/1200x700?text=Rental+Property"}
            alt={property.title}
            className="h-72 w-full object-cover sm:h-96"
          />

          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {property.bachelorAllowed && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Bachelor friendly
                  </span>
                )}
                {property.furnishing && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {property.furnishing}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{property.title}</h1>
                <p className="mt-2 text-sm text-slate-500">{property.location}</p>
              </div>

              <p className="text-3xl font-bold text-emerald-600">Rs. {property.price}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">About this home</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {property.description}
              </p>
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Contact landlord
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Reach out before you book a visit
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tenants can request the landlord's contact details here and get the number saved on the
              property owner profile.
            </p>

            {!isTenant && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Contact details are available for tenants.
              </div>
            )}

            {contactError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {contactError}
              </div>
            )}

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={handleGetContactDetails}
                disabled={!isTenant || contactLoading}
                className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {contactLoading ? "Loading contact details..." : "Get landlord contact details"}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !isTenant}
                className="w-full rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save property"}
              </button>
            </div>
          </section>

          {contactDetails && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-emerald-600">Landlord details</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {contactDetails.name || "Property owner"}
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </span>
                  <span className="mt-1 block break-all font-medium text-slate-900">
                    {contactDetails.email || "Not available"}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Contact number
                  </span>
                  <span className="mt-1 block font-medium text-slate-900">
                    {contactDetails.contactNumber || "Not shared yet"}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    WhatsApp number
                  </span>
                  <span className="mt-1 block font-medium text-slate-900">
                    {contactDetails.whatsappNumber || "Not shared yet"}
                  </span>
                </div>
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
};

export default PropertyDetails;
