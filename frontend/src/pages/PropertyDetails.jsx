import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { getStoredUser } from "../api/axios";
import { applyImageFallback, PROPERTY_IMAGE_FALLBACK } from "../utils/imageFallback";

const formatDialLink = (value) => {
  const normalized = String(value || "").replace(/[^\d+]/g, "");

  return normalized ? `tel:${normalized}` : "";
};

const formatWhatsAppLink = (value) => {
  const normalized = String(value || "").replace(/\D/g, "");

  return normalized ? `https://wa.me/${normalized}` : "";
};

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const user = getStoredUser();

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

  const landlord = property?.postedBy;
  const isTenant = user?.role === "tenant";

  const handleSave = async () => {
    try {
      await API.post(`/properties/${property._id}/save`);
      alert("Saved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save property");
    }
  };

  const handleContactLandlord = async (event) => {
    event.preventDefault();

    if (!requestMessage.trim()) {
      setRequestStatus("Please add a short message before sending.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestStatus("");

      await API.post(`/properties/${property._id}/contact`, {
        message: requestMessage.trim()
      });

      setRequestMessage("");
      setRequestStatus("Your message was sent to the landlord.");
    } catch (error) {
      setRequestStatus(error.response?.data?.message || "Unable to send request right now.");
    } finally {
      setSendingRequest(false);
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
          src={property.image || PROPERTY_IMAGE_FALLBACK}
          alt={property.title}
          className="h-80 w-full object-cover"
          onError={applyImageFallback}
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-600">Contact landlord</p>
                <p className="mt-1 text-sm text-slate-600">
                  View the landlord's contact details and send a quick request.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowContactDetails((current) => !current)}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {showContactDetails ? "Hide contact details" : "Contact landlord"}
              </button>
            </div>

            {showContactDetails && (
              <div className="mt-5 space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-lg font-bold text-slate-950">
                    {landlord?.name || "Landlord"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Direct contact details for this property.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
                    {landlord?.phone ? (
                      <a
                        href={formatDialLink(landlord.phone)}
                        className="mt-2 block font-semibold text-slate-950 hover:text-emerald-600"
                      >
                        {landlord.phone}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Not shared</p>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">WhatsApp</p>
                    {landlord?.whatsapp ? (
                      <a
                        href={formatWhatsAppLink(landlord.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block font-semibold text-slate-950 hover:text-emerald-600"
                      >
                        Chat on WhatsApp
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Not shared</p>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
                    {landlord?.email ? (
                      <a
                        href={`mailto:${landlord.email}`}
                        className="mt-2 block break-all font-semibold text-slate-950 hover:text-emerald-600"
                      >
                        {landlord.email}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Not shared</p>
                    )}
                  </div>
                </div>

                {isTenant ? (
                  <form onSubmit={handleContactLandlord} className="space-y-3">
                    <label htmlFor="requestMessage" className="block text-sm font-medium text-slate-700">
                      Send a message
                    </label>
                    <textarea
                      id="requestMessage"
                      name="requestMessage"
                      rows="4"
                      value={requestMessage}
                      onChange={(event) => setRequestMessage(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      placeholder="Hi, I am interested in this property. Please share more details."
                    />

                    {requestStatus && (
                      <p className="text-sm text-slate-600">{requestStatus}</p>
                    )}

                    <button
                      type="submit"
                      disabled={sendingRequest}
                      className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {sendingRequest ? "Sending..." : "Send request"}
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-slate-500">
                    Contact requests are available for tenants.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
