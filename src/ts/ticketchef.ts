import { BigNumberish, Contract, providers } from 'ethers';
import { contracts } from './index';

export const ticketchef = (signer) => {
  const contractAddress = '0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56';
  return new Contract(
    contractAddress,
    [
      'function enter(uint256 _amount)',
      'function leave(uint256 _amount)',
      'function swapStakeForTickets(uint256[] calldata _ticketTypes,uint256[] calldata _ticketValues)',
      'function balanceOf(address _owner) external view returns (uint256 balance_)'
    ],
    signer
  );
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
