<script lang='ts'>
 // @ts-ignore
 /* eslint-disable a11y-click-events-have-key-events, a11y-no-static-element-interactions */
 let {open, onClose, children} = $props()
</script>


{#if open}
<div
  class="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
  role="button"
  tabindex="0"
  onclick={onClose}
  onkeydown={(e) => e.key === 'Escape' ? onClose() : null}
  aria-label="dialog"
>
  <div 
    class="text-white p-2 animate-fade-in grid place-items-center w-5/6"
    onclick={(e) => e.stopPropagation()}
  >
    {@render children()}
  </div>
</div>
{/if}


<style>
@keyframes fade-in{
  from {
    opacity: 0;
    transform: scale(.95);
  }
  to{
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in{
  animation: fade-in .3s ease-out;
}
</style>