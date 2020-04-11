import store from 'store'
import { API } from 'utils/constants'
import { get, postJson, putJson, destroy } from 'utils/net'

const { REACT_APP_RT_USER: RT_USER, REACT_APP_RT_PASS: RT_PASS } = process.env

function getToken() {
  const user = store.get('app.user')
  return user && user.token
}

function getBaseAuthHeaders() {
  const credentials = Buffer.from(`${RT_USER}:${RT_PASS}`).toString('base64')
  return {
    Authorization: `Basic ${credentials}`,
  }
}

// Auth

export const login = (email, password) => postJson(API.LOGIN, { email, password })
export const register = () => postJson(API.REGISTER)

// Metadata

export const metadata = () => get(`${API.METADATA}`, null, getToken())

// Users

export const users = params => get(API.USERS, params, getToken())
export const userDetails = id => get(`${API.USERS}/${id}`, null, getToken())
export const userUpdateDetails = (id, params) => putJson(`${API.USERS}/${id}`, params, getToken())
export const userUpdateRoles = (id, params) =>
  putJson(`${API.USERS}/${id}/roles`, params, getToken())
export const userUpdateStatus = (id, params) =>
  putJson(`${API.USERS}/${id}/status`, params, getToken())
export const userResetPassword = email => postJson(API.RESETPASSWORD, email, getToken())
export const userDestroy = id => destroy(`${API.USERS}/${id}`, null, getToken())
export const userUpdatePassport = (id, params) =>
  putJson(`${API.USERS}/${id}/documents`, params, getToken())
export const userUpdateLicense = (id, params) =>
  putJson(`${API.USERS}/${id}/documents`, params, getToken())
export const userValidateDocument = (id, params) =>
  putJson(`${API.DOCUMENTS}/${id}`, params, getToken())
export const userTopupWallet = (id, params) =>
  putJson(`${API.USERS}/${id}/wallet`, params, getToken())
export const userListCC = id => get(`${API.USERS}/${id}/cc`, null, getToken())

// Below needs refactoring
export const scanQR = params => postJson(`${API.USERS}/scanqr`, params, getToken())
export const uploadImage = (id, params) => ({
  name: 'file',
  action: `${API.USERS}/${id}/image`,
  headers: {
    authorization: `Bearer ${getToken()}`,
  },
  data: params,
  accept: 'image/jpeg', // Only useful to pick items on File Explorer. DOES NOT exclude other types
  showUploadList: false,
  // Enforce image MIME-type ONLY
  beforeUpload: file => {
    if (file.type.startsWith('image')) {
      return true
    }
    return false
  },
  // Resize and change image quality regardless of the input file
  // Aspect ratio will me maintained and sized of file reduced
  transformFile: file => {
    return new Promise(resolve => {
      const maxWidth = 2000
      const maxHeight = 2000

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result

        img.onload = async () => {
          const elem = document.createElement('canvas')

          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
          const width = img.width * ratio
          const height = img.height * ratio

          elem.width = width
          elem.height = height

          const ctx = elem.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const blob = await new Promise(res => elem.toBlob(res, 'image/jpeg', 0.5))

          const newFile = await new File([blob], `resized_${file.name}`, {
            type: 'image/jpeg',
            lastModified: new Date(),
          })

          resolve(newFile)
        }
      }
    })
  },
})

// Promocodes

export const promocodes = params => get(API.PROMOCODES, params, getToken())
export const promocodeDetails = id => get(`${API.PROMOCODES}/${id}`, null, getToken())
export const promocodeUpdate = (id, params) =>
  putJson(`${API.PROMOCODES}/${id}`, params, getToken())
export const promocodeCreate = params => postJson(API.PROMOCODES, params, getToken())
export const promocodeDestroy = id => destroy(`${API.PROMOCODES}/${id}`, null, getToken())

// Admins

export const adminUpdatePoi = params => putJson(`${API.ME}/poi`, params, getToken())

// Trips

export const trips = params => get(API.TRIPS, params, getToken())
export const tripDetails = uuid => get(`${API.TRIPS}/${uuid}`, null, getToken())
export const addTrip = params => postJson(API.TRIPS, params, getToken())
export const endTrip = uuid => postJson(`${API.TRIPS}/${uuid}/close`, null, getToken())

// Vehicles

export const vehicles = params => get(API.VEHICLES, params, getToken())
export const vehicleDetails = uuid => get(`${API.VEHICLES}/${uuid}`, null, getToken())
export const vehicleUpdate = (uuid, params) =>
  putJson(`${API.VEHICLES}/${uuid}`, params, getToken())
export const vehicleHistory = (uuid, params) =>
  get(`${API.VEHICLES}/${uuid}/history`, params, getToken())
export const vehicleHistoryRoute = (uuid, params) =>
  get(`${API.VEHICLES}/${uuid}/history/route`, params, getToken())
export const vehicleMaintenance = (uuid, params) =>
  get(`${API.VEHICLES}/${uuid}/maintenance`, params, getToken())
export const assignToPOI = uuid => putJson(`${API.VEHICLES}/${uuid}/poi`, null, getToken())
export const assignModem = (uuid, params) =>
  putJson(`${API.VEHICLES}/${uuid}/modem`, params, getToken())
export const assignCanbox = (uuid, params) =>
  putJson(`${API.VEHICLES}/${uuid}/canbox`, params, getToken())
export const vehiclesMap = params => get(`${API.VEHICLES}/vehiclesLocations`, params, getToken())
export const vehicleDamage = uuid => get(`${API.VEHICLES}/${uuid}/damage`, null, getToken())

// Maintenance

export const maintenance = params => get(API.MAINTENANCE, params, getToken())
export const maintenanceDetails = id => get(`${API.MAINTENANCE}/${id}`, null, getToken())
export const maintenanceCreate = params => postJson(API.MAINTENANCE, params, getToken())
export const maintenanceUpdate = (id, params) =>
  putJson(`${API.MAINTENANCE}/${id}`, params, getToken())
export const maintenanceDone = id =>
  putJson(`${API.MAINTENANCE}/${id}/done`, { pending: 0 }, getToken())

// Vehicle control

export const vehicleLock = params =>
  postJson(`${API.VEHICLE_CONTROL}/lock`, params, null, getBaseAuthHeaders())
export const vehicleUnlock = params =>
  postJson(`${API.VEHICLE_CONTROL}/unlock`, params, null, getBaseAuthHeaders())
export const vehicleAuth = params =>
  postJson(`${API.VEHICLE_CONTROL}/auth`, params, null, getBaseAuthHeaders())
export const vehicleDeauth = params =>
  postJson(`${API.VEHICLE_CONTROL}/deauth`, params, null, getBaseAuthHeaders())
export const vehicleLights = params =>
  postJson(`${API.VEHICLE_CONTROL}/lights`, params, null, getBaseAuthHeaders())
export const vehicleTrunk = params =>
  postJson(`${API.VEHICLE_CONTROL}/trunk`, params, null, getBaseAuthHeaders())
export const vehicleStatus = params =>
  postJson(`${API.VEHICLE_CONTROL}/status`, params, null, getBaseAuthHeaders())
export const vehiclePosition = params =>
  postJson(`${API.VEHICLE_CONTROL}/alm`, { ...params, command: 'glog' }, null, getBaseAuthHeaders())

// Damage Reports
export const damages = params => get(API.DAMAGES, params, getToken())
export const damageDetails = id => get(`${API.DAMAGES}/${id}`, null, getToken())

// Canboxes

export const canboxes = params => get(API.CANBOXES, params, getToken())
export const createCanbox = params => postJson(API.CANBOXES, params, getToken())
export const canboxDetails = id => get(`${API.CANBOXES}/${id}`, null, getToken())
export const updateCanbox = (id, params) => putJson(`${API.CANBOXES}/${id}`, params, getToken())

// Modems

export const modems = params => get(API.MODEMS, params, getToken())
export const createModem = params => postJson(API.MODEMS, params, getToken())
export const modemDetails = id => get(`${API.MODEMS}/${id}`, null, getToken())
export const updateModem = (id, params) => putJson(`${API.MODEMS}/${id}`, params, getToken())

// Alerts

export const alertsVehicles = params => get(`${API.ALERTS}/vehicles`, params, getToken())
export const alertsMaintenance = params => get(`${API.ALERTS}/maintenance`, params, getToken())
