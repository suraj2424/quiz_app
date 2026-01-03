import { Cookies } from "react-cookie";

interface AlreadyLoggedInProps {
  onLogout: () => void;
}

export const AlreadyLoggedIn = ({ onLogout }: AlreadyLoggedInProps) => (
  <div className="w-screen h-screen flex justify-center items-center">
    <div className="px-10 py-5 border border-gray-200 rounded p-4 bg-slate-100">
      <p>You are already logged in!</p>
      <button
        onClick={onLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  </div>
);