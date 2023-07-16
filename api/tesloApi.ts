import axios from 'axios'

const tesloClientApi = axios.create({
  baseURL: '/api'
})

export default tesloClientApi