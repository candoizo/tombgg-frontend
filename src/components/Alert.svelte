<script lang="ts">
  export let hash;
</script>

{#if hash}
  <div
    class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4 flex"
    role="alert"
  >
    <a href={`https://polygonscan/tx/${hash}`}>
      <strong class="font-bold">Transaction Pending!</strong>
      <span class="block sm:inline">View on polygonscan ⤴️</span>
    </a>
    <div
      class="inline-flex text-xs my-auto ml-auto text-right ml-auto cursor-pointer"
    >
      Dismiss
    </div>
  </div>
{/if}
