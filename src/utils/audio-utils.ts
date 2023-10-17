export async function loadAudio(path: string) {
  try {
    const audioPath = chrome.runtime.getURL(path);

    const response = await fetch(audioPath);
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("Error loading audio:", error);
    return null;
  }
}

export const playAudio = (audio) => {
  return new Promise((resolve, reject) => {
    const audioObject = new Audio(audio);

    audioObject.onended = () => {
      resolve(null);
    };

    audioObject.onerror = (error) => {
      reject(error);
    };

    /*    audioObject.play();*/
  });
};
