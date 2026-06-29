import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API, { setStoredUser } from "../api/axios";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return "Email and password are required";
    }

    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/users/login", {
        email: formData.email.trim(),
        password: formData.password
      });

      setStoredUser(res.data, formData.rememberMe);
      navigate(redirectTo, { replace: true });

    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-12">

      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-[1fr_0.9fr]">

        <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Bachelor Rental Platform
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Find verified homes without the usual rental friction.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Save properties, contact landlords, and keep your rental search organized in one place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white/10 p-4">
              <span className="block text-2xl font-bold">24/7</span>
              <span className="text-slate-300">Access</span>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <span className="block text-2xl font-bold">Fast</span>
              <span className="text-slate-300">Search</span>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <span className="block text-2xl font-bold">Safe</span>
              <span className="text-slate-300">Auth</span>
            </div>
          </div>

        </div>

        <div className="p-6 sm:p-8 lg:p-10">

          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Login to your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              New here?{" "}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

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
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>

              <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

      </section>

    </main>

  );

};

export default Login;
