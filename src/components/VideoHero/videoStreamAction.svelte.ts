import VideoManager from "./VideoManager.svelte";
import { S3 } from "$lib/consts";

export default (node: HTMLVideoElement, { id }: { id: string }) => {
  let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const path = `${S3}/${isMobile ? "mobile/" : ""}`;
  node.setAttribute("src", `${path}IMG_E${id}.mp4`);
  node.dataset.videoId = id;
  node.volume = 0;
  node.load();
  const canplay = (e) => {
    if ((e.target as HTMLVideoElement).dataset.videoId === id) {
      VideoManager.ready(node);
    }
  };

  const timeupdate = (e) => {
    if ((e.target as HTMLVideoElement).dataset.videoId === id) {
      const timeRemaining = node.duration - node.currentTime;
      VideoManager.updateDebug(id, timeRemaining);
      if (timeRemaining <= 2) {
        VideoManager.next(id);
      }
      if (timeRemaining <= 0.1) {
        VideoManager.stop(id);
      }
    }
  };
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // if (isIOS) node.addEventListener("loadedmetadata", canplay);
  // else node.addEventListener("canplay", canplay);
  node.addEventListener("canplay", canplay);
  node.addEventListener("timeupdate", timeupdate);
  return {
    destroy() {
      // if (isIOS) node.removeEventListener("loadedmetadata", canplay);
      // else node.removeEventListener("canplay", canplay);
      node.removeEventListener("canplay", canplay);
      node.removeEventListener("timeupdate", timeupdate);
    },
  };
};
