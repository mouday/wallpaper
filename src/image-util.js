// Image对象转base64
function imageToBase64(image) {
  let canvas = document.createElement('canvas')

  canvas.width = image.width
  canvas.height = image.height

  let context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height)

  return canvas.toDataURL('image/png')
}

// 回调方式 Image url 转base64
function urlToBase64(url, callback = null) {
  let image = new Image()

  image.setAttribute('crossOrigin', 'Anonymous')
  image.src = url

  image.onload = function () {
    let dataURL = imageToBase64(image)
    if (callback) {
      callback(dataURL)
    }
  }
}

// Promise方式 Image url 转base64
export function urlToBase64Async(url) {
  return new Promise((resolve, reject) => {
    urlToBase64(url, (data) => {
      resolve(data)
    })
  })
}

/**
 * 从base64编码中解析图片信息
 * @param {String} base64 
 * eg: data:image/gif;base64,R0lGODlhAQABAPcAAAuvCwu1Cwy6DAy/DA
 * 
 * @returns {Object}
 * eg: 
 * {
    type: 'image/gif',
    ext: 'gif',
    data: 'R0lGODlhAQABAPcAAAuvCwu1Cwy6DAy/DA'
 */
export function parseBase64(base64) {
  let re = new RegExp('data:(?<type>.*?);base64,(?<data>.*)')
  let res = re.exec(base64)

  if (res) {
    return {
      type: res.groups.type,
      ext: res.groups.type.split('/').slice(-1)[0],
      data: res.groups.data,
    }
  }
}

/**
 * 拷贝图片到剪切板
 * @param {*} imageUrl 
 */
export async function copyImageToClipboard(imageUrl) {
  const base64Url = await urlToBase64Async(imageUrl)

  const parsedBase64 = parseBase64(base64Url)

  let type = parsedBase64.type

  //将base64转为Blob类型
  let bytes = atob(parsedBase64.data)
  let ab = new ArrayBuffer(bytes.length)
  let ua = new Uint8Array(ab)

  for (let i = 0; i < bytes.length; i++) {
    ua[i] = bytes.charCodeAt(i)
  }

  let blob = new Blob([ab], { type })

  navigator.clipboard.write([new ClipboardItem({ [type]: blob })])
}
