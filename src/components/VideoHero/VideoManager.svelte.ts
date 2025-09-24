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
      node.dataset.status = "PLAYING";
      node.play();
    }
    if (this.collection.length !== this.ids.length) {
      this.collection.push(node);
    }
  }
  next(id: string) {
    const hasTransitionOut = this.collection.find(
      (video) => video.dataset.status === "TRANSITION-OUT"
    );
    if (hasTransitionOut) return;

    const nextId = this.getNextStream(id);
    const nextVideo = this.collection.find(
      (video) => video.dataset.videoId === nextId
    );
    const currentVideo = this.collection.find(
      (video) => video.dataset.videoId === id
    );

    currentVideo!.dataset.status = "TRANSITION-OUT";
    nextVideo!.dataset.status = "PLAYING";
    nextVideo!.play();
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
    return Array.from(available)[Math.floor(Math.random() * available.size)];
  }
  get playlist() {
    return this.collection;
  }
  updateDebug(id: string, count: number) {
    this.debug[id] = count;
  }
}

export default new VideoManager();
