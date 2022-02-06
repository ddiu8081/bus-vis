import ky from 'ky'

const api = ky.create({prefixUrl: 'https://service-4a2rnaqt-1251746595.bj.apigw.tencentcs.com/'})

const searchByKeyword = async (city: string, name: string): Promise<searchResult> => {
  return await api.get('search', {
    searchParams: {
      city: city,
      keyword: name
    }
  }).json()
}

export {
  searchByKeyword,
}