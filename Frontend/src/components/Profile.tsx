import { useEffect, useState } from "react";
import { Edit, Share, Mail } from "lucide-react";
import { Cookies } from "react-cookie";
import { motion } from "framer-motion";

interface User {
  user: {
    name: string;
    email: string;
    type: string;
  };
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = cookies.get("token");
        const response = await fetch("http://localhost:5000/api/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("User data fetch failed:", error);
      }
    };
    const timer = setTimeout(()=> {
        fetchUser();
    },1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-violet-600">
        </div>
      </div>
    );
  }

  return (
    <motion.div className="relative w-screen h-screen bg-neutral-100 flex items-center justify-center overflow-hidden" initial={{ opacity:0, translateY: 20 }} animate={{ opacity: 100, translateY: 0 }}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

      <div className="relative z-10 w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        <div className="relative w-full h-40 bg-neutral-900 flex items-center justify-center">
          <div className="absolute -bottom-16 w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img
              src={"https://cdn-icons-png.flaticon.com/512/10559/10559204.png"}
              alt="Profile"
              className="h-full w-full object-cover grayscale hover:grayscale-0 
                         transition-all duration-500 transform hover:scale-105"
            />
          </div>
        </div>

        <div className="flex-grow grid grid-cols-2 p-6 pt-24 gap-6">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-neutral-900">{user.user.name}</h1>
            <div className="inline-block px-4 py-1 bg-neutral-200 rounded-full">
              <p className="text-neutral-700 font-medium tracking-wider uppercase text-sm">
                {user.user.type}
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-neutral-900 text-white 
                           rounded-full hover:bg-neutral-700 
                           transition-all duration-300 
                           flex items-center gap-2 group"
              >
                <Edit className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                className="px-6 py-2 border border-neutral-900 text-neutral-900 
                                 rounded-full hover:bg-neutral-100 
                                 transition-all duration-300 
                                 flex items-center gap-2 group"
              >
                <Share className="w-4 h-4 text-neutral-900 group-hover:scale-110 transition-transform" />
                Share
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-100 rounded-2xl p-6 border border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                Contact
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={user.user.name}
                    onChange={(e) => setUser({ ...user, user: { ...user.user, name: e.target.value } })}
                    className="w-full p-2 bg-white border border-neutral-300 
                             rounded-lg text-neutral-900 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={user.user.email}
                    onChange={(e) =>
                      setUser({ ...user, user: { ...user.user, email: e.target.value } })
                    }
                    className="w-full p-2 bg-white border border-neutral-300 
                             rounded-lg text-neutral-900 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={user.user.type}
                    onChange={(e) => setUser({ ...user, user: { ...user.user, type: e.target.value } })}
                    className="w-full p-2 bg-white border border-neutral-300 
                             rounded-lg text-neutral-900 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Type"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-neutral-700" />
                    <p className="text-neutral-700">{user.user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
