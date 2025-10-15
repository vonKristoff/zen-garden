import { S3 } from "$lib/consts";
interface Player {
  id: string;
  node: HTMLVideoElement;
}
class VideoManager {
  ids: string[] = $state([]);
  playback = $state<Player[]>([]);
  queue = $state<string[]>([]);
  isPlaying = $state(false);

  init(ids: string[]) {
    this.ids = ids;
    // preload 2 players
    const randomId = this.getNextStream(
      this.ids[Math.floor(this.ids.length * Math.random())]
    );
    this.queue.push(randomId);
    this.queue.push(this.getNextStream(randomId));
  }
  setupNode(id: string, node: HTMLVideoElement) {
    const video = this.queue.pop();
    node.dataset.player = id;
    node.dataset.video = video;
    node.src = this.getPath(video);
    node.load();
    this.playback.push({ id, node });
  }

  async ready(node: HTMLVideoElement): Promise<void> {
    node.dataset.status = "READY";
    // IF FIRST VIDEO
    if (!this.isPlaying) {
      this.isPlaying = true;
      node.volume = 0;
      node.dataset.status = "PLAYING";
      document.documentElement.classList.add("video-loaded");
      try {
        await node.play();
      } catch (e) {
        console.error("Cannot play this", e);
      }
    }
  }
  async next(currentVideo: HTMLVideoElement): Promise<void> {
    if (currentVideo.dataset.status === "TRANSITION-OUT") return;
    currentVideo!.dataset.status = "TRANSITION-OUT";

    const next = this.playback.find(
      ({ node }) => node.dataset.status === "READY"
    );
    try {
      await next.node.play();
      next.node.dataset.status = "PLAYING";
      this.queue.push(this.getNextStream(next.node.dataset.video));
    } catch {
      console.error("Cannot connect to stream");
    }
  }

  getPath(id: string) {
    let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const path = `${S3}/${isMobile ? "mobile/" : ""}`;
    return `${path}IMG_E${id}.mp4`;
  }

  stop(currentVideo: HTMLVideoElement) {
    // stop finished video
    currentVideo!.dataset.status = "IDLE";
    currentVideo!.pause();
    currentVideo!.currentTime = 0;
    // prepare next video stream
    if (this.queue.length) {
      currentVideo.dataset.video = this.queue.pop() as string;
      currentVideo.src = this.getPath(currentVideo.dataset.video);
      currentVideo.load();
    }
  }
  getNextStream(current: (typeof this.ids)[number]) {
    const available = new Set(this.ids);
    available.delete(current);
    const newId =
      Array.from(available)[Math.floor(Math.random() * available.size)];
    return newId;
  }
}

export default new VideoManager();
