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

export function minifyPng(dataUrl: string, factor: number) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width / factor;
      canvas.height = img.height / factor;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedDataUrl = canvas.toDataURL("image/png");
      resolve(resizedDataUrl);
    };

    img.onerror = function () {
      reject(new Error("Failed to load image for resizing."));
    };
  });
}
