import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "../api/axios";

const Navbar = () => {

  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) => {
    return `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-slate-950 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">

        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
            BR
          </span>
          Rentals
        </Link>

        <div className="flex flex-wrap items-center gap-2">

          <NavLink to="/" className={navLinkClass}>
            Properties
          </NavLink>

          {!user?.token ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "tenant" && (
                <NavLink to="/saved" className={navLinkClass}>
                  Saved
                </NavLink>
              )}

              <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 sm:flex">
                <span className="font-semibold text-slate-950">
                  {user.name || "Account"}
                </span>
                {user.role && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold capitalize text-emerald-700">
                    {user.role}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </nav>
    </header>
  );
};

export default Navbar;
