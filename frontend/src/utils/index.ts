import axios, { AxiosResponse, AxiosError } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { getAuthHeaders } from './headers'

export const fetcher = (url: string, headers = getAuthHeaders()) =>
  axios
    .get(url, { headers })
    .then((res: AxiosResponse) => camelcaseKeys(res.data, { deep: true }))
    .catch((err: AxiosError) => {
      console.log(err.message)
      throw err
    })
