class VideoManager {
  ids: string[] = $state([]);
  collection = $state<HTMLVideoElement[]>([]);
  debug = $state<Record<string, number>>({});
  init(ids: string[]) {
    this.ids = ids;
  }
  ready(node: HTMLVideoElement) {
    this.updateDebug(node.dataset.videoId, node.duration);
    if (this.collection.length < 1) {
      document.documentElement.classList.add("video-loaded");
      node.dataset.status = "PLAYING";
      node.play();
    }
    if (node && this.collection.length !== this.ids.length) {
      this.collection.push(node);
    }
  }
  async next(id: string) {
    const hasTransitionOut = this.collection.find(
      (video) => video.dataset.status === "TRANSITION-OUT"
    );
    if (hasTransitionOut) return;

    const nextId = this.getNextStream(id);
    const nextVideo = this.collection.find(
      (video) => video.dataset.videoId === nextId
    );
    if (!nextVideo) return this.next(id);
    const currentVideo = this.collection.find(
      (video) => video.dataset.videoId === id
    );

    currentVideo!.dataset.status = "TRANSITION-OUT";

    try {
      await nextVideo.play();
      nextVideo.dataset.status = "PLAYING";
    } catch {
      console.log("retry a different stream");
      this.next(id);
    }
    // await playVideoWithRetry(nextVideo);
  }
  stop(id: string) {
    const currentVideo = this.collection.find(
      (video) => video.dataset.videoId === id
    );
    currentVideo!.dataset.status = "IDLE";
    currentVideo!.pause();
    currentVideo!.currentTime = 0;
  }
  getNextStream(current: (typeof this.ids)[number]) {
    const available = new Set(this.ids);
    available.delete(current);
    const newId =
      Array.from(available)[Math.floor(Math.random() * available.size)];
    return newId;
  }
  get playlist() {
    return this.collection;
  }
  updateDebug(id: string, count: number) {
    this.debug[id] = count;
  }
}

async function playVideoWithRetry(node) {
  const maxAttempts = 10;
  const delay = 1000;
  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    try {
      await node.play();
      node.dataset.status = "PLAYING";
      return; // Success!
    } catch (e) {
      if (attempt === maxAttempts) {
        console.error("Max retries reached. Playback failed.");
        throw e;
      }
      console.error(`Playback attempt ${attempt} failed:`, e.message);
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
}

export default new VideoManager();
