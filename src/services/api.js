/* eslint import/prefer-default-export: 0 */

import { API } from 'utils/constants'
import { postJson } from 'utils/net'

// Auth
export const login = (email, password) => postJson(API.LOGIN, { email, password })
