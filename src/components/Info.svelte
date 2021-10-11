<script>
  export let title;
</script>

<div
  class="flex flex-col text-center bg-gray-900 rounded-md pb-2 w-2/5 mx-auto w-48"
>
  <div class="font-semibold uppercase bg-purple-800 rounded-md p-2 mb-2">
    {title}
  </div>
  <div class="font-bold">
    <slot />
  </div>
</div>
