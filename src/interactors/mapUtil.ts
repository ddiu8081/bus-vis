import { FlyToInterpolator } from 'deck.gl'
import md5 from 'js-md5'
import ky from 'ky'
import gcoord from 'gcoord'
import type { ViewStateProps } from '@deck.gl/core/lib/deck'

const convertLocation = (
  location: [number, number] = [0, 0]
): [number, number] => {
  return gcoord.transform(location, gcoord.GCJ02, gcoord.WGS84)
}

const generateViewStateOptions = (
  location: [number, number],
  zoom: number,
  duration: number = 2400
): ViewStateProps => {
  const mapBoxLocation = convertLocation(location)
  return {
    longitude: mapBoxLocation[0],
    latitude: mapBoxLocation[1],
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

const p_parseTextData = (lineData: string): string[] => {
  const lineDataArr = lineData.split('|').map(x => p_decryptText(x))
  return lineDataArr
}

const decodeMinifyLineData = (
  minifyLineString?: string
): [number, number][] => {
  if (!minifyLineString) {
    return []
  }
  const points = minifyLineString.split(';').map(p => p.split(','))
  let last_blng = 0
  let last_blat = 0
  let linePath: [number, number][] = []
  for (let j = 0; j < points.length; j++) {
    const point = points[j]
    const blng = parseInt(point[0]) + last_blng
    const blat = parseInt(point[1]) + last_blat
    last_blng = blng
    last_blat = blat
    if (blng && blat) {
      linePath.push(convertLocation([blng / 1000000, blat / 1000000]))
    }
  }
  return linePath
}

const getAndParseLineData = async (cityId: string) => {
  const requestPath = `/data/line/${cityId}.data`
  const requestSecret = import.meta.env.VITE_CDN_VERIFY_SECRET
  const url = p_generateDownloadUrl(requestSecret, requestPath)
  const data_line = await ky.get(url).text()
  const parsed = p_parseTextData(data_line)
  if (parsed) {
    const totalPath: DrawLineItem[] = []
    for (let i = 0; i < parsed.length; i++) {
      const line_str = parsed[i]
      let lineId = ''
      let lineName = ''
      let lineColor = undefined
      let minifyLineStr = line_str
      const lineInfoArr = line_str.split('@')
      if (lineInfoArr.length > 1) {
        const meta = lineInfoArr[0].split(',')
        if (meta.length === 3) {
          lineId = meta[0]
          lineName = meta[1]
          lineColor = meta[2]
        } else if (meta.length === 2) {
          lineId = meta[0]
          lineName = meta[1]
        }
        minifyLineStr = lineInfoArr[1]
      }
      const currentPath = decodeMinifyLineData(minifyLineStr)
      totalPath.push({
        id: lineId,
        name: lineName,
        path: currentPath,
        color: lineColor,
      })
    }
    return totalPath
  }
  return []
}

const getAndParseStopData = async (cityId: string) => {
  const requestPath = `/data/stop/${cityId}.data`
  const requestSecret = import.meta.env.VITE_CDN_VERIFY_SECRET
  const url = p_generateDownloadUrl(requestSecret, requestPath)
  const data_stop = await ky.get(url).text()
  const parsed = p_parseTextData(data_stop)
  if (parsed) {
    const totalStop: DrawStopItem[] = []
    for (let i = 0; i < parsed.length; i++) {
      const stop_str = parsed[i]
      const stopInfoArr = stop_str.split(',')
      if (stopInfoArr.length === 4) {
        totalStop.push({
          id: stopInfoArr[0],
          name: stopInfoArr[1],
          location: [parseFloat(stopInfoArr[2]), parseFloat(stopInfoArr[3])],
        })
      }
    }
    return totalStop
  }
  return []
}

function hexToRgb(hex: string): [number, number, number] | null {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

export {
  convertLocation,
  generateViewStateOptions,
  decodeMinifyLineData,
  getAndParseLineData,
  getAndParseStopData,
  hexToRgb,
}
