/* === URLs === */

const { REACT_APP_BASE_URL: BASE_URL } = process.env
const API_URL = `${BASE_URL}/api/v1/admin`

export const API = {
  LOGIN: `${API_URL}/auth/login`,
}

export const ADMIN_ROLES = ['admin']

export const APP_LAST_UPDATE = 'YYYY.MM.DD'
