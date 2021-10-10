import { BigNumberish } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';
import { contracts } from './index';

export const ticketchef = (signer) => {
  const contractAddress = '0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205';
  const abi = [
    'function totalSupply() external view returns (uint256 totalSupply_)',
    'function balanceOf(address _owner, uint256 _id) external view returns (uint256 balance_)',
    'function swapStakeForTickets(uint256[] calldata _ticketTypes, uint256[] calldata _ticketValues) public',
    'function swapGhstForTickets(uint256[] calldata _ticketTypes, uint256[] calldata _ticketValues) public',
    'function enter(uint256 _amount) public',
    'function leave(uint256 _share) public'
  ];
  return new Contract(contractAddress, abi, signer);
};

async function stake(signer: JsonRpcSigner, value?: BigNumberish) {
  const chef = ticketchef(signer);
  console.log(`zomg stake: `, value);
  if (value === 'max') {
    const addr = await signer.getAddress();
    value = await contracts().ghst.balanceOf(addr);
  }
  if (typeof value === 'string')
    throw new Error("Value should be a number or 'max'");
  return await chef.enter(value);
}

async function unstake(signer: JsonRpcSigner, value?: BigNumberish) {
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
