import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setStoredUser } from "../api/axios";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      return "Name, email and password are required";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/users/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });

      setStoredUser(res.data);
      navigate("/");

    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-12">

      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-[0.9fr_1fr]">

        <div className="p-6 sm:p-8 lg:p-10">

          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600">Create your account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Start your rental journey
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Login instead
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                I am joining as
              </span>
              <div className="grid grid-cols-2 gap-3">
                {["tenant", "landlord"].map((role) => (
                  <label
                    key={role}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold capitalize transition ${
                      formData.role === role
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

        </div>

        <div className="hidden bg-emerald-600 p-10 text-white md:flex md:flex-col md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Built for bachelors and landlords
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Search smarter, list faster, manage everything clearly.
            </h2>
          </div>

          <div className="space-y-4 text-sm text-emerald-50">
            <div className="rounded-xl bg-white/15 p-4">
              Tenants can save homes and contact property owners directly.
            </div>
            <div className="rounded-xl bg-white/15 p-4">
              Landlords can manage listings and view interested users.
            </div>
          </div>

        </div>

      </section>

    </main>

  );

};

export default Register;
