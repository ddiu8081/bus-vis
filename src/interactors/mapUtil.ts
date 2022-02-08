import { ViewStateProps } from '@deck.gl/core/lib/deck'
import { FlyToInterpolator } from 'deck.gl'
import md5 from 'js-md5'
import ky from 'ky'
import gcoord from 'gcoord'

const generateViewStateOptions = (location: [number, number], zoom: number, duration: number = 3000): ViewStateProps => {
  return {
    longitude: location[0],
    latitude: location[1],
    zoom: zoom,
    pitch: 0,
    bearing: 0,
    transitionDuration: duration,
    transitionInterpolator: new FlyToInterpolator(),
  }
}

const p_generateDownloadUrl = (secret: string, path: string) => {
  const host = import.meta.env.VITE_CDN_HOST
  const timestampHex = Math.floor(Date.now() / 1000).toString(16)
  const md5Hash = md5(secret + path + timestampHex)
  return `${host}/${md5Hash}/${timestampHex}${path}`
}

const p_decryptText = (encryptedText: string): string => {
  let newTextArr = encryptedText.split('').reverse()
  newTextArr = newTextArr.map(char => {
    const charCode = char.charCodeAt(0)
    return String.fromCharCode(charCode - 1)
  })
  const newText = newTextArr.join('')
  const decodedText = decodeURIComponent(escape(window.atob(newText)))
  return decodedText
}

const p_parseLineData = (lineData: string): string[] => {
  const lineDataArr = lineData.split('|').map(x => p_decryptText(x))
  return lineDataArr
}

const getAndParseData = async (cityId: string) => {
  const requestPath = `/data/line/${cityId}.data`
  const requestSecret = import.meta.env.VITE_CDN_VERIFY_SECRET
  const url = p_generateDownloadUrl(requestSecret, requestPath)
  const data_line = await ky.get(url).text()
  const parsed = p_parseLineData(data_line)
  if (parsed) {
    const totalPath: DrawLineItem[] = []
    for (let i = 0; i < parsed.length; i++) {
      const line_str = parsed[i]
      const points = line_str.split(';').map(p => p.split(','))
      let lineId = ''
      let lineName = ''
      let last_blng = 0
      let last_blat = 0
      let currentPath: [number, number][] = []
      for (let j = 0; j < points.length; j++) {
        const point = points[j]
        if (j == 0 && point.length === 2) {
          lineId = point[0]
          lineName = point[1]
          continue
        }
        const blng = parseInt(point[0]) + last_blng
        const blat = parseInt(point[1]) + last_blat
        last_blng = blng
        last_blat = blat
        if (blng && blat) {
          currentPath.push(
            gcoord.transform(
              [blng / 1000000, blat / 1000000],
              gcoord.GCJ02,
              gcoord.WGS84
            )
          )
        }
      }
      totalPath.push({
        id: lineId,
        name: lineName,
        path: currentPath,
      })
    }
    return totalPath
  }
  return []
}

export {
  generateViewStateOptions,
  getAndParseData,
}