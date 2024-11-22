import { createContext, ReactNode } from "react";
import { useCookies } from "react-cookie";

type TokenDetails = {
    token: string | null,
    setToken: (newToken: string) => void,
    removeToken: () => void
}

export const TokenContext = createContext<TokenDetails>({} as TokenDetails);

interface TokenContextData {
    children: ReactNode;
}

const TokenContextProvider = ({ children }: TokenContextData) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const setToken = (newToken: string) => {
        setCookie('token', newToken, { path: '/' });
    };

    const removeToken = () => {
        removeCookie('token', { path: '/' });
    };

    const value = {
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
