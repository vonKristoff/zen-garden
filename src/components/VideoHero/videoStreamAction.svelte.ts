import VideoManager from "./VideoManager.svelte";

export default (node: HTMLVideoElement, { player }: { player: string }) => {
  VideoManager.setupNode(player, node);

  const canplay = (e) => {
    if ((e.target as HTMLVideoElement).dataset.player === player) {
      VideoManager.ready(node);
    }
  };

  const timeupdate = (e) => {
    if ((e.target as HTMLVideoElement).dataset.player === player) {
      const timeRemaining = node.duration - node.currentTime;
      if (timeRemaining <= 2) {
        VideoManager.next(node);
      }
    }
  };
  const ended = (e) => {
    if ((e.target as HTMLVideoElement).dataset.player === player) {
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
