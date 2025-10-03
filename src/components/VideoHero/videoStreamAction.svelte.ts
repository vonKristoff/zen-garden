import VideoManager from "./VideoManager.svelte";

export default (node: HTMLVideoElement, { id }: { id: string }) => {
  node.dataset.videoId = id;
  node.load();
  node.removeAttribute("loop");
  const canplay = (e) => {
    if ((e.target as HTMLVideoElement).dataset.videoId === id) {
      VideoManager.ready(node);
    }
  };

  const timeupdate = (e) => {
    if ((e.target as HTMLVideoElement).dataset.videoId === id) {
      const timeRemaining = node.duration - node.currentTime;
      if (timeRemaining <= 2) {
        VideoManager.next(node, id);
      }
    }
  };
  const ended = (e) => {
    if ((e.target as HTMLVideoElement).dataset.videoId === id) {
      VideoManager.stop(node);
    }
  };
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) node.addEventListener("loadedmetadata", canplay);
  else node.addEventListener("canplay", canplay);
  // node.addEventListener("canplay", canplay);
  node.addEventListener("timeupdate", timeupdate);
  node.addEventListener("ended", ended);
  return {
    destroy() {
      if (isIOS) node.removeEventListener("loadedmetadata", canplay);
      else node.removeEventListener("canplay", canplay);
      // node.removeEventListener("canplay", canplay);
      node.removeEventListener("ended", ended);
      node.removeEventListener("timeupdate", timeupdate);
    },
  };
};
