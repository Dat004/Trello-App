import { GoogleOAuthProvider } from '@react-oauth/google';

import ENV_CONFIG from "@/config/env";

function GoogleProvider({ children }) {
    return <GoogleOAuthProvider clientId={ENV_CONFIG.GOOGLE_CLIENT_API}>
        {children}
    </GoogleOAuthProvider>
}

export default GoogleProvider;
