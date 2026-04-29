import { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const savedData = localStorage.getItem("user");
    const initialUser = savedData ? JSON.parse(savedData) : null;
    const [user, setUserState] = useState(initialUser);

    const setUser = (userData) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            // localStorage.setItem("userId", userData._id);
        } else {
            localStorage.removeItem("user");
            // localStorage.removeItem("userId");
        }
    };

    const isAuthenticated = ()=>{
        if(user) return true;
        return false;
    }

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used inside UserProvider");
    return context;
};
