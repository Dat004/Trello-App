const env = import.meta.env;

const ENV_CONFIG = {
    API_URL: env.VITE_API_URL || 'http://localhost:5000',
    CLOUDINARY_API_URL: env.VITE_CLOUDINARY_API_URL,
}

export default ENV_CONFIG;
