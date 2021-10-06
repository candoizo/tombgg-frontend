import { BigNumberish, Contract, providers } from 'ethers';
import { contracts } from './index';

import { abi } from './ticketchef.json';

export const ticketchef = (signer) => {
  const contractAddress = '0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205';
  return new Contract(contractAddress, abi, signer);
};

async function stake(signer: providers.JsonRpcSigner, value?: BigNumberish) {
  const chef = ticketchef(signer);
  console.log(`zomg stake: `, value);
  if (value === 'max') {
    const addr = await signer.getAddress();
    value = await contracts.ghst.balanceOf(addr);
  }
  if (typeof value === 'string')
    throw new Error("Value should be a number or 'max'");
  return await chef.enter(value);
}

async function unstake(signer: providers.JsonRpcSigner, value?: BigNumberish) {
  const chef = ticketchef(signer);
  console.log(`zomg unstake: `, value);
  if (value === 'max') {
    const addr = await signer.getAddress();
    value = await chef.balanceOf(addr);
  }
  if (typeof value === 'string')
    throw new Error("Value should be a number or 'max'");
  return await chef.leave(value);
}

export { stake, unstake };
