import { net, getToken } from 'lib'

const { get } = net

const url = `https://devct.free.beeceptor.com`

const BeeceptorDelay = params => get(`${url}/delay`, params, getToken())

export default {
  BeeceptorDelay,
}
