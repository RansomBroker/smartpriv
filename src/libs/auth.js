import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);
export function AuthenticationProvider({ router, children }) {

    const [authdUser, setAuthdUser] = useState(null)
    useEffect(() => {
        if (authdUser == null) {
            const authKey = localStorage.getItem('authKey');
            if (authKey) {

            } else {
                router.navigate('/');
            }
        }
    }, []);

    return <AuthContext.Provider value={[authdUser, setAuthdUser]}>
        {children}
    </AuthContext.Provider>

}