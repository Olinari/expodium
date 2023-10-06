import pako from "pako";

export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export async function compressBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function () {
      try {
        const compressed = pako.deflate(reader.result);
        resolve(new Blob([compressed]));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = function () {
      reject(new Error("Failed to read blob."));
    };
  });
}
