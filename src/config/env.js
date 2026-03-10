const env = import.meta.env;

const ENV_CONFIG = {
    API_URL: env.VITE_API_URI || 'http://localhost:5000',
    CLOUDINARY_API_URL: env.VITE_CLOUDINARY_API_URL,
    GOOGLE_CLIENT_API: env.VITE_GOOGLE_CLIENT_API,
}

export default ENV_CONFIG;
