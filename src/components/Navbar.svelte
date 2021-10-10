<script lang="ts">
  export let view;
</script>

<div class="flex flex justify-center h-42 font-bold text-lg md:text-xl">
  <div class="my-auto mx-2">
    <div
      class="flex mx-auto my-2 text-white bg-pink-500 hover:bg-pink-400 border-0 py-2 px-8 focus:outline-none rounded text-center cursor-pointer"
      on:click={() => (view = 'stake')}
    >
      <div class="mx-auto w-full">
        Stake GHST
        <div class="text-xs">make FRENS</div>
      </div>
    </div>
  </div>
  <div class="my-auto mx-2">
    <div
      class="flex mx-auto my-2 text-white bg-green-600 hover:bg-green-500 border-0 py-2 px-8 focus:outline-none rounded text-center cursor-pointer"
      on:click={() => (view = 'tickets')}
    >
      <div class="mx-auto ">
        Buy Tickets
        <div class="text-xs">over the counter</div>
      </div>
    </div>
  </div>
</div>
