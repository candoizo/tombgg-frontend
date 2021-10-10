<script lang="ts">
  export const linkInfo = [
    {
      href: '/faq',
      color: 'bg-purple-500',
      hover: 'bg-purple-700',
      text: 'Questions'
    },
    {
      href: 'https://polygonscan.com/address',
      color: 'bg-indigo-500',
      hover: 'bg-indigo-700',
      text: 'Contract'
    },
    {
      href: '/faq',
      color: 'bg-blue-500',
      hover: 'bg-blue-700',
      text: 'GitHub'
    }
  ];
</script>

<div class="flex justify-center uppercase gap-4 my-2 font-bold">
  {#each linkInfo as info}
    <a
      href={info.href}
      class="{info.color} hover:{info.hover} rounded p-2 w-28 text-sm flex"
    >
      <div class="mx-auto">{info.text}</div>
    </a>
  {/each}
</div>
