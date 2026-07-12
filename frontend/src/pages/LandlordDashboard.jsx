import { useEffect, useState } from "react";
import API from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  location: "",
  bachelorAllowed: "true",
  furnishing: "",
};

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get("/properties/my-properties");
      setProperties(res.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedImage(null);
    setSelectedImageName("");
    setCurrentImage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setSelectedImage(file || null);
    setSelectedImageName(file ? file.name : "");
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setForm({
      title: property.title || "",
      description: property.description || "",
      price: property.price?.toString() || "",
      location: property.location || "",
      bachelorAllowed: property.bachelorAllowed ? "true" : "false",
      furnishing: property.furnishing || "",
    });
    setSelectedImage(null);
    setSelectedImageName("");
    setCurrentImage(property.image || "");
    setError("");
    setMessage("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Title is required";
    }

    if (!form.description.trim()) {
      return "Description is required";
    }

    if (!form.price.trim() || Number.isNaN(Number(form.price))) {
      return "Please enter a valid price";
    }

    if (!form.location.trim()) {
      return "Location is required";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("location", form.location.trim());
      payload.append("bachelorAllowed", form.bachelorAllowed);
      payload.append("furnishing", form.furnishing.trim());

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      if (editingId) {
        await API.put(`/properties/${editingId}`, payload);
        setMessage("Property updated successfully");
      } else {
        await API.post("/properties", payload);
        setMessage("Property added successfully");
      }

      await fetchProperties();
      resetForm();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to save property");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (propertyId) => {
    const confirmed = window.confirm("Remove this property listing?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(propertyId);
      setError("");
      setMessage("");

      await API.delete(`/properties/${propertyId}`);

      if (editingId === propertyId) {
        resetForm();
      }

      setProperties((current) => current.filter((property) => property._id !== propertyId));
      setMessage("Property removed successfully");
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Unable to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  const totalInterestedUsers = properties.reduce((count, property) => {
    return count + (property.interestedUsers?.length || 0);
  }, 0);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Landlord dashboard
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_0.6fr] md:items-end">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Add, update, and remove your property listings from one place.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep your listings current, refresh details when rent changes, and manage every property you own
                without leaving the dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">Listings</p>
                <p className="mt-2 text-3xl font-bold">{properties.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">Interested users</p>
                <p className="mt-2 text-3xl font-bold">{totalInterestedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {(error || message) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                {editingId ? "Edit property" : "New property"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {editingId ? "Update listing details" : "Add a property for bachelors"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                Property title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Spacious 2BHK near metro"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Tell renters what makes this place a good fit"
              />
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700">
                Monthly rent
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="18000"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Indiranagar, Bengaluru"
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Bachelor allowed
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      form.bachelorAllowed === option.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bachelorAllowed"
                      value={option.value}
                      checked={form.bachelorAllowed === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="furnishing" className="mb-2 block text-sm font-medium text-slate-700">
                Furnishing
              </label>
              <input
                id="furnishing"
                name="furnishing"
                type="text"
                value={form.furnishing}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Fully furnished"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="mb-2 block text-sm font-medium text-slate-700">
                Property image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
              />

              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                {editingId && currentImage ? (
                  <p className="break-all">
                    Current image: <span className="font-medium text-slate-900">{currentImage}</span>
                  </p>
                ) : (
                  <p>No image selected yet</p>
                )}
                {selectedImageName && (
                  <p className="mt-1">
                    New file: <span className="font-medium text-slate-900">{selectedImageName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting
                  ? editingId
                    ? "Updating..."
                    : "Publishing..."
                  : editingId
                    ? "Update property"
                    : "Add property"}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Your listings</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Manage live properties</h2>
          </div>

          {loading ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              Loading your listings...
            </p>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              You have not added any properties yet.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {properties.map((property) => (
                <article
                  key={property._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={property.image || "https://via.placeholder.com/800x400?text=Property"}
                      alt={property.title}
                      className="h-56 w-full object-cover"
                    />
                    {property.bachelorAllowed && (
                      <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        Bachelor friendly
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{property.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{property.location}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                        Rs. {property.price}
                      </span>
                      {property.furnishing && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                          {property.furnishing}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                        {property.interestedUsers?.length || 0} interested users
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                      {property.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(property)}
                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Edit details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(property._id)}
                        disabled={deletingId === property._id}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === property._id ? "Removing..." : "Remove property"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default LandlordDashboard;
