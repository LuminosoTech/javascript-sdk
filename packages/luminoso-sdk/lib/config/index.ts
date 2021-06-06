export const REQUEST_TIMEOUT_MS = 60 * 1000; // 1 minute

export const getBaseUrl = () => {
  switch (process.env.NODE_ENV) {
    case "local":
      return "http://localhost:5000/sdk";
    case "development":
      return "http://localhost:5000/sdk";
    case "production":
      return "https://api.luminoso.tech/sdk";
    default:
      return "http://localhost:5000/sdk";
  }
};
