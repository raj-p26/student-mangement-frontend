import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
      <nav className="bg-gray-200 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div>
            {location.pathname !== "/" && (
              <button
                className="bg-transparent shadow-none"
                onClick={() => navigate(-1)}
              >
                <svg
                  className="h-5 w-5 text-slate-900 "
                  fill="none"
                  viewBox="0 0 26 26"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}

            <Link to={"/"} className="text-3xl ml-2 text-black no-underline ">
              Student Mangement Admin
            </Link>
          </div>

          <div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("update-details");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
export { Header };
