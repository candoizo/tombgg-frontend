const ghst = '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7';
const quickswap = {
  ghst: ghst,
  quick: '',
  usdc: '',
  weth: ''
};

const sushi = {
  ghst: ghst,
  matic: ''
};

export default {
  31337: {
    // forking https://polygon-rpc.com
    rpc: 'http://localhost:8545',
    ghst: ghst,
    frens: '0xA02d547512Bb90002807499F05495Fe9C4C3943f',
    pools: {
      0: ghst,
      1: quickswap.usdc,
      2: quickswap.quick,
      3: quickswap.weth,
      4: sushi.matic
    },
    chef: '0xF48883F2ae4C4bf4654f45997fE47D73daA4da07',
    multicall: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507'
  },
  137: {
    rpc: 'https://polygon-rpc.com',
    ghst: ghst,
    frens: '0xA02d547512Bb90002807499F05495Fe9C4C3943f',
    pools: {
      0: ghst,
      1: quickswap.usdc,
      2: quickswap.quick,
      3: quickswap.weth,
      4: sushi.matic
    },
    chef: '0xF48883F2ae4C4bf4654f45997fE47D73daA4da07',
    multicall: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507'
  },
  80001: {
    rpc: '',
    ghst: '',
    frens: '',
    chef: '',
    multicall: ''
  }
};
