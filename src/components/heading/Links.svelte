<script lang="ts">
  export const linkInfo = [
    { href: '/faq', color: 'purple', text: 'Questions' },
    {
      href: 'https://polygonscan.com/address',
      color: 'indigo',
      text: 'Contract'
    },
    { href: '/faq', color: 'blue', text: 'GitHub' },
    { href: '/faq', color: 'yellow', text: 'Vote' }
  ];
</script>

<div class="flex justify-center uppercase gap-4 my-2 font-bold">
  {#each linkInfo as info}
    <a
      href={info.href}
      class="bg-{info.color}-500 hover:bg-{info.color}-700 rounded p-2 w-28 text-sm flex"
    >
      <div class="mx-auto">{info.text}</div>
    </a>
  {/each}
</div>
