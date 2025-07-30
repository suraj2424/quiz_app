import { useEffect, useState } from "react";
import { Edit, Share, Mail } from "lucide-react";
import { Cookies } from "react-cookie";
import { motion, AnimatePresence } from "framer-motion";

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
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/verify-token`, {
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
    const timer = setTimeout(fetchUser, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!user) {
    return (
      <motion.div 
        className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-50 to-neutral-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-16 h-16 border-4 border-neutral-300 border-t-neutral-700 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="relative min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-neutral-800 to-neutral-700 flex items-center justify-center">
          <motion.div 
            className="absolute bottom-0 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/10559/10559204.png"
              alt="Profile"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>

        {/* Profile Content */}
        <div className="p-6 pt-16 text-center">
          <motion.h1 
            className="text-3xl font-bold text-neutral-900 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user.user.name}
          </motion.h1>

          <motion.div 
            className="inline-block px-3 py-1 bg-neutral-200 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-neutral-700 font-medium tracking-wider uppercase text-xs">
              {user.user.type}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex justify-center space-x-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              onClick={handleEdit}
              className="px-5 py-2 bg-neutral-900 text-white rounded-full 
                         hover:bg-neutral-700 transition-colors duration-300 
                         flex items-center gap-2 group"
            >
              <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              {isEditing ? "Save" : "Edit"}
            </button>
            <button 
              className="px-5 py-2 border border-neutral-900 text-neutral-900 
                         rounded-full hover:bg-neutral-100 
                         transition-colors duration-300 
                         flex items-center gap-2 group"
            >
              <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Share
            </button>
          </motion.div>

          {/* Contact Information */}
          <AnimatePresence>
            {isEditing ? (
              <motion.div 
                key="edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={user.user.name}
                  onChange={(e) => setUser({ ...user, user: { ...user.user, name: e.target.value } })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 
                             rounded-lg focus:ring-2 focus:ring-neutral-500/50"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={user.user.email}
                  onChange={(e) =>
                    setUser({ ...user, user: { ...user.user, email: e.target.value } })
                  }
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 
                             rounded-lg focus:ring-2 focus:ring-neutral-500/50"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={user.user.type}
                  onChange={(e) => setUser({ ...user, user: { ...user.user, type: e.target.value } })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 
                             rounded-lg focus:ring-2 focus:ring-neutral-500/50"
                  placeholder="Type"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="contact-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center items-center space-x-3"
              >
                <Mail className="w-5 h-5 text-neutral-700" />
                <p className="text-neutral-700">{user.user.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;