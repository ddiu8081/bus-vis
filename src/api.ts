import ky from 'ky'

const api = ky.create({prefixUrl: 'https://service-4a2rnaqt-1251746595.bj.apigw.tencentcs.com/'})

const searchByKeyword = async (city: string, name: string): Promise<SearchResult> => {
  return await api.get('search', {
    searchParams: {
      city: city,
      keyword: name
    }
  }).json()
}

const getStopDeatilById = async (id: string): Promise<StopData | null> => {
  const result: RequestResult<StopData> =  await api.get(`detail/stop`, {
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
}