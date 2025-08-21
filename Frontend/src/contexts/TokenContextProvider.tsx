import { createContext, ReactNode } from "react";
import { useCookies } from "react-cookie";

type TokenDetails = {
    token: string | null;
    setToken: (newToken: string) => void;
    removeToken: () => void;
}

export const TokenContext = createContext<TokenDetails | undefined>(undefined);

interface TokenContextProviderProps {
    children: ReactNode;
}

export const TokenContextProvider = ({ children }: TokenContextProviderProps) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const setToken = (newToken: string) => {
        setCookie('token', newToken, { 
            path: '/',
            sameSite: 'strict', // Add security options
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            maxAge: 60 * 60 * 24 * 7 // 7 days expiry (optional)
        });
    };

    const removeToken = () => {
        removeCookie('token', { path: '/' });
    };

    const value: TokenDetails = {
        token: cookies.token || null,
        setToken,
        removeToken
    };

    return (
        <TokenContext.Provider value={value}>
            {children}
        </TokenContext.Provider>
    );
};



export default TokenContextProvider;