import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-950">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
              BN
            </span>
            Bachelor Nest
          </Link>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Helping students and professionals discover verified bachelor-friendly rentals.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 Bachelor Nest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
