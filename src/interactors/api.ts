import ky from 'ky'
import CryptoJS from 'crypto-js'

const createSignature = (request: Request, dateTime: string): string => {
  var url = new URL(request.url)
  const signingStr = [
    `x-date: ${dateTime}`,
    request.method.toUpperCase(),
    request.headers.get('Accept'),
    request.headers.get('Content-Type'),
    '',
    url.pathname + decodeURIComponent(url.search),
  ].join('\n')
  const signing = CryptoJS.HmacSHA1(signingStr, import.meta.env.VITE_API_APPSECRET).toString(CryptoJS.enc.Base64)
  const sign = `hmac id="${import.meta.env.VITE_API_APPKEY}", algorithm="hmac-sha1", headers="x-date", signature="${signing}"`
  return sign
}

const api = ky.create({
  prefixUrl: 'https://bus-api.ddiu.site/',
  hooks: {
    beforeRequest: [
      request => {
        const dateTime = new Date().toUTCString()
        const sign = createSignature(request, dateTime)
        request.headers.set('x-date', dateTime)
        request.headers.set('Authorization', sign)
      }
    ]
  }
})

const searchByKeyword = async (city: string, name: string): Promise<SearchResult> => {
  return await api.get('search', {
    searchParams: {
      city: city,
      keyword: name
    }
  }).json()
}

const getStopDeatilById = async (id: string): Promise<StopData | null> => {
  const result: RequestResult<StopData> = await api.get(`detail/stop`, {
    searchParams: {
      id: id,
    }
  }).json()
  if (result.code === 1) {
    return result.data
  }
  return null
}

const getLineDeatilById = async (id: string): Promise<LineData | null> => {
  const result: RequestResult<LineData> = await api.get(`detail/line`, {
    searchParams: {
      id: id,
    }
  }).json()
  if (result.code === 1) {
    return result.data
  }
  return null
}

export {
  searchByKeyword,
  getStopDeatilById,
  getLineDeatilById,
}