import { useContext } from "react";
import { TokenContext } from "./TokenContextProvider";

export const useToken = () => {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useToken must be used within a TokenContextProvider');
    }
    return context;
};