import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Grad-Connect
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/job-search" className="hover:text-blue-200">
                Job Search
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to={
                      user.type === "graduate"
                        ? "/graduate-profile"
                        : "/employer-profile"
                    }
                    className="hover:text-blue-200"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-blue-200">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/" className="hover:text-blue-200">
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
