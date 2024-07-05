import { useReadContract } from "wagmi";
import { contracts } from "../utils/blockchain";

const { XDAO, erc20Abi } = contracts;

export const useAllowance = ({ tokenAddress, owner, spender }) => {
  const config = {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  };

  const { data } = useReadContract(config);

  return data;
};

export const useBalanceOf = ({ tokenAddress, owner }) => {
  const config = {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [owner],
  };

  const { data } = useReadContract(config);

  return data;
};


export const useTotalSupply = ({ tokenAddress }) => {
  const config = {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "totalSupply",
    args: [],
  };

  const { data } = useReadContract(config);

  return data;
};

export const useDecimals = ({ tokenAddress }) => {
  const config = {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    args: [],
  };

  const { data } = useReadContract(config);

  return data;
};

export const useSaleInfo = ({ tokenAddress, index }) => {
  const config = {
    address: XDAO.address,
    abi: XDAO.abi,
    functionName: "getSaleInfo",
    args: [tokenAddress, index],
  };

  const { data } = useReadContract(config);

  return data;
};

export const useRegularFeeRate = () => {
  const config = {
    address: XDAO.address,
    abi: XDAO.abi,
    functionName: "regularFeeRate",
    args: [],
  };

  const { data } = useReadContract(config);

  return data;
};
