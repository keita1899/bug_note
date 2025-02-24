import axios, { AxiosResponse, AxiosError } from 'axios'
import camelcaseKeys from 'camelcase-keys'

export const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res: AxiosResponse) => camelcaseKeys(res.data, { deep: true }))
    .catch((err: AxiosError) => {
      console.log(err.message)
      throw err
    })
