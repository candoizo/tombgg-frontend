<!-- onload -->
<script context="module" lang="ts">
  import '../app.scss';
  import { aggregate } from '@makerdao/multicall';
  import {
    getDefaultProvider,
    BigNumber,
    utils,
    Contract,
    providers
  } from 'ethers';
  import { getProps, provider, contracts, mcConfig } from '../ts';
  export async function load({ fetch }) {
    const prices = [];
    for (let i = 0; i <= 6; i++) {
      const callInfo = {
        returns: [
          [
            'ticket_cost_' + i,
            (val: BigNumber) => parseFloat(utils.formatEther(val))
          ]
        ],
        target: '0xA02d547512Bb90002807499F05495Fe9C4C3943f',
        call: ['ticketCost(uint256)(uint256)', i]
      };
      prices.push(callInfo);
    }
    const multires = await aggregate(prices, mcConfig);
    const ticketPrices = Object.fromEntries(
      Object.keys(multires.results.transformed).map((key, index) => {
        const frenCost = multires.results.transformed[key];
        console.log(key, frenCost, frenCost * (1.5 / 1000));
        const ghstPerThousandFrens = 1.5;
        const ghstPriceFrenRate = frenCost * (ghstPerThousandFrens / 1000);
        return [index, ghstPriceFrenRate];
      })
    );
    console.log(`ticketPrices: `, ticketPrices);

    const pro = await getProps();
    console.log(pro);
    return {
      status: 200,
      props: {
        userStake: BigNumber.from(0),
        ticketPrices: ticketPrices,
        ...pro
      }
    };
  }
</script>

<!-- props available here -->
<script lang="ts">
  import detectEthereumProvider from '@metamask/detect-provider';
  let user = { active: 'stake', account: '' };
  export let accountSigner;
  export let userAccount;
  export let userBalance;
  export let userStake;
  export let ghst;
  export let contractAddress;
  export let ticketPrices;
  export let totalCost;
  export let ticketchef;
  export let ticketAmounts = Object.fromEntries(
    Object.keys(ticketPrices).map((key) => [key, 0])
  );
  let stakeAmount = '';
  // import { Contract } from 'ethers';

  const toggle = (test: string) => (user.active = test);

  export let pendingTx;
  async function buyTickets(est) {
    console.log('Buying tickets! zomg', ticketPrices, ticketAmounts);
    const tx = await ticketchef.swapStakeForTickets(
      Object.keys(ticketAmounts),
      Object.values(ticketAmounts)
    );
    console.log(`Approve tx: `, tx);
    pendingTx = tx.hash;
    const conf = await tx.wait();
    console.log(`Approve conf: `, conf);

    // check approval to spend ghst
    // const ticketchef = new Contract("0x...", "", )
    // await ticketchef.swapGhstForTicket(0, 0);
    // const ticketTypes =
    // const arg1 = Object.keys(ticketAmounts).map(key => {
    //   const amount = ticketAmounts[key];
    //   if (amount > 0) {
    //
    //   }
    // })

    // ticketChef.swapGhstForTicket(ticketAmounts, ticketPrices);
  }

  function updateTotal() {
    console.log(`zomg changed buy field plz`, ticketPrices, ticketAmounts);
    let total = 0;
    Object.keys(ticketPrices).map((key) => {
      console.log((ticketPrices[key] * ticketAmounts[key]).toFixed(3));
      total += parseFloat((ticketPrices[key] * ticketAmounts[key]).toFixed(3));
    });
    totalCost = total;
  }

  async function connectWallet() {
    console.log(`zomg connect wallet plz`);
    const provider = await detectEthereumProvider();
    const enabledAccounts = await provider.enable();
    accountSigner = new providers.Web3Provider(provider).getSigner();
    contractAddress = '0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56';
    ticketchef = new Contract(
      contractAddress,
      [
        'function enter(uint256 _amount)',
        'function leave(uint256 _amount)',
        'function swapStakeForTickets(uint256[] calldata _ticketTypes,uint256[] calldata _ticketValues)',
        'function balanceOf(address _owner) external view returns (uint256 balance_)'
      ],
      accountSigner
    );
    if (enabledAccounts && enabledAccounts.length > 0) {
      const firstAccount = enabledAccounts[0];
      userAccount = firstAccount;
      user.account = firstAccount.slice(0, 4) + '...' + firstAccount.slice(-4);
      console.log(accountSigner, enabledAccounts);

      // check if ghst is approved
      if (!contractAddress) contractAddress = firstAccount;
      const approve = await ghst.allowance(firstAccount, contractAddress);
      console.log(
        `Account is approved to spend ghst?`,
        approve
        // providers.getSigner(firstAccount)
      );
      user.approveGhstContract = approve.gt(0);

      // const userBalanceCheck = await ghst.balanceOf(
      //   '0x40863E9462449C8FF022881eC205906C38e6edc1'
      // );
      // userBalance = parseFloat(utils.formatEther(userBalanceCheck)).toFixed(2);
      updateBalances();
    }
  }

  async function updateBalances() {
    const balance = await ghst.balanceOf(userAccount);
    userBalance = utils.formatEther(balance);
    const stakeBalance = await ticketchef.balanceOf(userAccount);
    userStake = utils.formatEther(stakeBalance);
  }

  async function userApprove() {
    console.log(`zomg approve ghst:`, accountSigner);

    const tx = await approve(accountSigner);
    pendingTx = tx.hash;

    const conf = await tx.wait();
    console.log(`Approve conf: `, conf);
    if (conf) {
      user.approveGhstContract = true;
      updateBalances();
    }
  }

  async function stake(value?: string) {
    console.log(`zomg stake: `, value, stakeAmount);
    if (value === 'max') {
      const max = await ghst.balanceOf(userAccount);
      stakeAmount = utils.formatEther(max);
    }
    if (stakeAmount > 0) {
      const testStake = utils.parseEther(stakeAmount.toString());
      console.log(testStake);
      const tx = await ticketchef.enter(testStake);
      console.log(`Stake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      console.log(`Stake conf: `, conf);
      if (conf) {
        // reload balances
        updateBalances();
        stakeAmount = '';
      }
    }
  }

  async function unstake(value?: string) {
    console.log(`zomg unstake: `, value, stakeAmount);
    if (value === 'max') {
      const max = await ticketchef.balanceOf(userAccount);
      stakeAmount = utils.formatEther(max);
    }
    if (stakeAmount > 0) {
      const testStake = utils.parseEther(stakeAmount.toString());
      console.log(testStake);
      const tx = await ticketchef.leave(testStake);
      console.log(`Unstake tx: `, tx);
      pendingTx = tx.hash;
      const conf = await tx.wait();
      console.log(`Unstake conf: `, conf);
      if (conf) {
        // reload balances
        updateBalances();
        stakeAmount = '';
      }
    }
  }
</script>

<div class="mt-6 flex justify-between w-4/5 mx-auto bg-purple-800 rounded p-2">
  <a href="/" class="text-4xl text-left font-semibold">
    <div class="text-pink-400">FRENBank</div>
    <div class="text-xs">Autocompounding GHST / ticket market!</div>
  </a>
  <div
    class="bg-indigo-400 hover:bg-indigo-300 rounded p-1 px-4 h-12 m-auto ml-auto mr-0 flex cursor-pointer w-36 md:w-48 justify-center"
    on:click={() => connectWallet()}
  >
    <div class="flex flex-col">
      <div class="my-auto font-semibold md:hidden text-center">
        {user.account || 'Connect'}
      </div>
      <div class="my-auto font-semibold hidden md:flex">
        {user.account || 'Connect Wallet'}
      </div>
      <div class="text-xs mx-auto">{user.account && 'Connected'}</div>
    </div>
  </div>
</div>

<div class="flex justify-center uppercase gap-4 my-2 font-bold">
  <a
    href="/faq"
    class="bg-purple-500 hover:bg-purple-400 rounded p-2 w-28 text-sm flex"
  >
    <div class="mx-auto">wat?</div>
  </a>
  <a
    href="httos://polygonscan.com/address/0x"
    class="bg-indigo-400 hover:bg-indigo-300 rounded p-2 w-28 text-sm flex"
  >
    <div class="mx-auto">Contract</div>
  </a>
  <a
    href="/faq"
    class="bg-blue-400 hover:bg-blue-300 rounded p-2 w-28 text-sm flex "
  >
    <div class="mx-auto">GitHub</div>
  </a>
  <a
    href="/faq"
    class="bg-yellow-500 hover:bg-yellow-400 rounded p-2 w-28 text-sm flex"
  >
    <div class="mx-auto">Vote</div>
  </a>
</div>

<div class="flex flex justify-center h-42 font-bold text-lg md:text-xl">
  <div class="my-auto mx-2">
    <a
      class="flex mx-auto my-2 text-white bg-pink-500 hover:bg-pink-400 border-0 py-2 px-8 focus:outline-none  rounded text-center cursor-pointer"
      on:click={() => toggle('stake')}
      ><div class="mx-auto w-full">
        🚜 Stake GHST
        <div class="text-xs">exchange xGHST</div>
      </div></a
    >
  </div>
  <div class="my-auto mx-2">
    <a
      class="flex mx-auto my-2 text-white bg-green-600 hover:bg-green-500 border-0 py-2 px-8 focus:outline-none rounded text-center cursor-pointer"
      on:click={() => toggle('tickets')}
      ><div class="mx-auto ">
        🎫 Buy Tickets
        <div class="text-xs">over the counter</div>
      </div></a
    >
  </div>
</div>
<div class="w-4/5 mx-auto mt-4">
  {#if user.active === 'stake'}
    <div class="text-2xl font-semibold md:hidden">🚜 Stake</div>
    <div class="text-3xl font-semibold hidden md:flex">🚜 Stake GHST</div>
    <div>Trade frens for autocompounding GHST!</div>
    <div class="flex flex-col justify-center mt-4">
      <!-- <div class="text-center text-sm">
        Exchange raffle tickets at a stable price and distributes the spoils to
        stakers directly as autocompounding GHST!
      </div> -->
      <div
        class="my-2 text-center text-base bg-purple-400 rounded-lg py-2 w-full md:w-4/5 mx-auto"
      >
        <div>xGHST APY: 7d(+12%) 365d(+123%)</div>
        <div>xGHST Rate: 1 xGHST = 1.25 GHST</div>
        <div>FRENS Rate: 1000 FRENS = 1.5 GHST</div>
      </div>
    </div>
    <div class="rounded bg-purple-600 p-2 mt-4 w-full">
      <div class="text-2xl flex">
        <img
          src="/ghst.gif"
          width="32px"
          height="32px"
          class="image-pixelated inline my-auto"
        />
        <div class="my-auto font-bold">xGHST (uses GHST)</div>
        <a href="https://app.1inch.io" class="ml-2 underline cursor-pointer"
          >Buy GHST</a
        >
      </div>

      <div class="flex w-full justify-around">
        <div>
          Balance: {userBalance ? parseFloat(userBalance).toFixed(2) : 0} GHST
        </div>
        <div>Deposited: {userStake || 0} GHST</div>
      </div>
      <div class="flex w-full justify-around">
        <div class="flex flex-col">
          <input
            class="text-black w-4/5 mx-auto"
            type="number"
            min="0"
            max={parseFloat(userBalance || '0')}
            bind:value={stakeAmount}
          />
          {#if !user.approveGhstContract}
            <a
              class="flex bg-green-600 rounded w-1/2 mx-auto py-2 my-2 cursor-pointer"
              on:click={() => userApprove()}
              ><div class="mx-auto">Approve GHST</div></a
            >
          {:else}
            <div class="flex">
              <a
                class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
                on:click={() => stake()}><div class="mx-auto">Deposit</div></a
              >
              <a
                class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
                on:click={() => stake('max')}
                ><div class="mx-auto">Deposit All</div></a
              >
            </div>
            <div class="flex">
              <a
                class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
                on:click={() => unstake()}
                ><div class="mx-auto">Withdraw</div></a
              >
              <a
                class="flex bg-green-600 rounded w-1/2 mx-auto py-2 m-2 w-2/5 cursor-pointer"
                on:click={() => unstake('max')}
                ><div class="mx-auto">Withdraw All</div></a
              >
            </div>
          {/if}
          <div class="flex justify-around">
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
      </div>
    </div>

    <div
      class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4 flex"
      role="alert"
    >
      <a href={`https://polygonscan/tx/${pendingTx}`}>
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
  {#if user.active === 'migrate'}
    <div class="">Migrate stkGHST</div>
  {/if}
  {#if user.active === 'tickets'}
    <div class="flex justify-between">
      <div class="my-auto">
        <div class="text-2xl font-semibold md:hidden">🎫 Buy</div>
        <div class="text-3xl font-semibold hidden md:flex">🎫 Buy Tickets</div>
        <div class="">Buy from the bank with GHST!</div>
        <div class="flex">
          <div class="my-auto text-sm">
            User Balance: {userBalance || 'not connected'}
          </div>
          {#if userBalance}
            <img
              src="/ghst.gif"
              width="28px"
              height="28px"
              class="image-pixelated inline"
            />
          {/if}
        </div>
      </div>
      <div class="my-auto flex">
        <div
          class="rounded bg-green-600 hover:bg-green-500 w-32 p-1 m-2 flex flex-col cursor-pointer text-center"
          on:click={() => buyTickets()}
        >
          <div class="flex m-auto uppercase font-semibold">Purchase</div>
          <div class="flex justify-center">
            <div class="my-auto text-sm">{totalCost || 0} GHST</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grid-cols-2 w-full mx-auto">
      {#each Object.keys(ticketPrices) as index}
        <div class="flex justify-center mx-4">
          <img
            src="/tickets/{index}.svg"
            width="100"
            height="100"
            class="mx-auto my-4"
          />
          <div class="flex justify-end w-2/3">
            <div class="flex flex-col justify-center">
              <div class="text-2xs -mb-6 text-center" style="font-size: 12px">
                price
              </div>
              <div class="my-auto">{ticketPrices[index]} GHST ×</div>
            </div>
            <div class="flex flex-col w-1/4 justify-center">
              <div class="text-2xs text-center mb-1" style="font-size: 12px">
                amount
              </div>
              <input
                type="number"
                min="0"
                class="text-black my-auto mx-1 text-center rounded -mt-0"
                bind:value={ticketAmounts[index]}
                on:change={() => updateTotal()}
              />
            </div>
            <div class="my-auto hidden">
              = {ticketAmounts[index] > 0
                ? (ticketPrices[index] * ticketAmounts[index]).toFixed(3)
                : 0} GHST
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  {#if user.active === 'unstake'}
    <div class="">Unstake xGHST</div>
  {/if}
</div>

<style lang="scss">
  :global(body) {
    background: rgb(37, 18, 77);
    max-width: 650px;
    margin: auto;
    padding: 0 16px;
    color: white;
    overflow-y: hidden;
  }
</style>
