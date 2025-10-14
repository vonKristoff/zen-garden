<script lang="ts">
  import videoStream from "./videoStreamAction.svelte";
  import VideoManager from "./VideoManager.svelte";
  import { onMount } from "svelte";
  let { title, ids, children, icon } = $props();
  onMount(() => VideoManager.init(ids));
</script>

<div
  class="absolute z-10 grid h-screen w-screen place-content-center font-serif"
>
  <div class="flex flex-col justify-center items-center px-8 wrap-anywhere">
    <h1 id="title" class="text-red-700 text-4xl md:text-8xl">
      {title}
      {#if icon}
        {@render icon()}
      {/if}
    </h1>
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<!-- {#each VideoManager.ids as id}
<div class="video absolute grid place-content-center">
  <video
    use:videoStream={{ id }}
    data-status="IDLE"
    muted
    loop
    playsinline
    preload="metadata"><source src="" type="video/mp4" /></video
  >
</div>
{/each} -->
{#if VideoManager.ids.length}
  <div class="video grid place-content-center">
    <video
      use:videoStream={{ player: "SATURN" }}
      data-status="IDLE"
      muted
      playsinline
      preload="metadata"><source src="" type="video/mp4" /></video
    >
    <video
      use:videoStream={{ player: "VENUS" }}
      data-status="IDLE"
      muted
      playsinline
      preload="metadata"><source src="" type="video/mp4" /></video
    >
  </div>
{/if}

<style>
  #title {
    transition: color 1s;
  }
  :global(.video-loaded #title) {
    color: white;
  }
  .video {
    position: relative;
    transition: all 2s;
  }
  video {
    transition: all 4s;
    position: absolute;
    width: 100vw;
    height: 100dvh;
    object-fit: cover;
  }
  :global(video[data-status="TRANSITION-OUT"]) {
    opacity: 0;
    z-index: 5;
  }
  :global(video[data-status="IDLE"]) {
    opacity: 0;
    z-index: 0;
  }
  :global(video[data-status="READY"]) {
    opacity: 0;
    z-index: 0;
  }
  :global(video[data-status="PLAYING"]) {
    opacity: 1;
    z-index: 1;
  }
</style>
