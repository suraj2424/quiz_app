import { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';

interface User {
  user: {
    name: string;
    email: string;
  }
}

const WatermarkBackground = () => {
  const [user, setUser] = useState<User | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = cookies.get('token');
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    };

    verifyToken();
  }, []);

  if (!user) return null;

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      <div className="absolute inset-0 grid grid-cols-4 gap-8 transform -rotate-45">
        {Array(14).fill(0).map((_, index) => (
          <div 
            key={index}
            className="text-gray-400 text-sm whitespace-nowrap opacity-100"
            style={{
              transform: `translateY(${index * 50}px)`,
              fontFamily: 'monospace'
            }}
          >
            {user.user.name} • {new Date().toISOString().split('T')[0]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatermarkBackground;