<!-- onload -->
<script context="module">
  import '../app.scss';

  import { getDefaultProvider, BigNumber, utils } from 'ethers';
  import { IERC20__factory } from '@aavegotchi/sdk';
  export async function load({ fetch }) {
    const provider = getDefaultProvider('https://polygon-rpc.com');
    const ghst = IERC20__factory.connect(
      '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7',
      provider
    );
    const userBalance = await ghst.balanceOf(
      '0x40863E9462449C8FF022881eC205906C38e6edc1'
    );
    let userStake = BigNumber.from(0);
    return {
      props: {
        userBalance: parseFloat(utils.formatEther(userBalance)).toFixed(2),
        userStake: userStake
      }
    };

    return {
      status: 200,
      error: 'End of thing error'
    };
  }
</script>

<!-- props available here -->
<script>
  let user = { active: false };
  export let userBalance;
  export let userStake;
  export const exchangeRate = 1.5;
  function toggle(test) {
    // console.log(user, provider);
    user.active = test;
  }
</script>

<div class="mt-6">
  <div class="text-pink-400 text-4xl text-center font-semibold">
    TicketDAO Prices
  </div>
  <div class="text-center text-xs">
    Raffle tickets for a stable frens price!
  </div>
  <div class="my-4 text-center text-xs">FRENS Rate: 1000 FRENS = 1.5 GHST</div>
</div>

<div class="flex justify-center uppercase gap-4 my-2">
  <a href="/faq" class="bg-red-400 rounded p-2 w-28 text-sm flex">
    <div class="mx-auto">FAQ</div>
  </a>
  <a
    href="httos://polygonscan.com/address/0x"
    class="bg-red-400 rounded p-2 w-28 text-sm flex"
  >
    <div class="mx-auto">Contracts</div>
  </a>
  <a href="/faq" class="bg-red-400 rounded p-2 w-28 text-sm flex">
    <div class="mx-auto">GitHub</div>
  </a>
</div>

<div class="flex flex-col justify-center mt-4">
  <div class="text-center">
    Exchange raffle tickets at a stable price and distributes the spoils to
    stakers directly as autocompounding GHST!
  </div>
  <div class="my-2">
    <div class="text-center text-lg">xGHST Rate: 1 xGHST = 1.25 GHST</div>
    <div class="text-center text-lg">APY Estimate: 7d(+50%) 365d(+330%)</div>
  </div>
</div>
<div class="flex flex justify-center h-42">
  <div class="my-auto mx-2">
    <a
      class="flex mx-auto my-2 text-white bg-purple-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg text-center"
      on:click={() => toggle('stake')}
      ><div class="mx-auto">
        Stake GHST
        <div class="text-xs">Receive xGHST</div>
      </div></a
    >
  </div>
  <div class="my-auto mx-2">
    <a
      class="flex mx-auto my-2 text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg text-center"
      on:click={() => toggle('tickets')}
      ><div class="mx-auto">
        Buy Tickets
        <div class="text-xs">over the counter</div>
      </div></a
    >
  </div>
</div>
<div>
  {#if user.active === 'stake'}
    <div class="">Stake GHST</div>
    <div class="rounded bg-purple-600 p-2">
      <div>Stake GHST or stkGHST for xGHST</div>
      <div class="flex w-full">
        <div>Balance: {userBalance}</div>
        <div>Deposited: {userStake}</div>
      </div>
      <input class="text-black" type="text" />
    </div>
    <div class="rounded bg-purple-600 p-2 mt-4 w-full">
      <div class="text-xl">GHST (uses stkGHST)</div>
      <div>Buy GHST</div>
      <div class="flex w-full justify-around">
        <div>Balance: {userBalance} GHST</div>
        <div>Deposited: {userStake} GHST</div>
      </div>
      <div class="flex w-full justify-around">
        <div>
          <input class="text-black" type="text" />
          <a
            class="flex bg-green-600 rounded w-1/2 mx-auto py-2 my-2"
            on:click={() => toggle('migrate')}
            ><div class="mx-auto">Approve</div></a
          >
          <div class="flex">
            <div>Deposit fee: 0%</div>
            <div>Withdrawal Fee: 0%</div>
          </div>
          <div class="text-xs">
            You will receive xGHST as a receipt for your deposited GHST. This
            token is needed to withdraw your GHST, <b
              >do not trade or transfer</b
            >
            this token to strangers.
          </div>
        </div>
        <input class="text-black" type="text" />
      </div>
    </div>
  {/if}
  {#if user.active === 'migrate'}
    <div class="">Migrate stkGHST</div>
  {/if}
  {#if user.active === 'tickets'}
    <div class="">Buy Tickets</div>
    <div class="flex flex-col grid-cols-2">
      <div>
        <img src="/tickets/1.svg" width="160" height="160" />
        {exchangeRate * 50}
        <input type="number" class="text-black" />
      </div>
      <img src="/tickets/2.svg" width="160" height="160" />
      <img src="/tickets/3.svg" width="160" height="160" />
      <img src="/tickets/4.svg" width="160" height="160" />
      <img src="/tickets/5.svg" width="160" height="160" />
      <img src="/tickets/6.svg" width="160" height="160" />
      <img src="/tickets/7.svg" width="160" height="160" />
    </div>
  {/if}
  {#if user.active === 'unstake'}
    <div class="">Unstake xGHST</div>
  {/if}
</div>

<style lang="scss">
  :global(body) {
    font-family: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
      monospace;
    background: rgb(37, 18, 77);
    max-width: 650px;
    margin: 32px auto;
    padding: 0 16px;
    color: white;
  }
</style>
