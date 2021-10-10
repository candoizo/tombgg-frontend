<script>
  export let title;
</script>

<div class="flex flex-col text-center bg-gray-900 rounded-lg pb-2 w-2/5">
  <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
    {title}
  </div>
  <div class="font-bold">
    <slot />
  </div>
</div>
