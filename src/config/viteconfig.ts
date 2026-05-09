interface AppConfig {
  API_BASE_URL: string;
}

const Config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

const viteConfig: AppConfig = Config;
export default viteConfig;
