export const DEFAULT_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const MIN_UPDATE_INTERVAL = 1000;

export const DEFAULT_URL_TEMPLATE = `http://localhost:5000/datafiles/%s.json`;

export const DEFAULT_AUTHENTICATED_URL_TEMPLATE = `https://config.luminoso.tech/datafiles/auth/%s.json`;

export const BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT = [0, 8, 16, 32, 64, 128, 256, 512];

export const REQUEST_TIMEOUT_MS = 60 * 1000; // 1 minute
