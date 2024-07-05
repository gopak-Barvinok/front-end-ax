import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { notifyError, notifyInfo, notifySuccess } from "../components/Toasts";
import { contracts } from "../utils/blockchain";

const { XDAO, erc20Abi } = contracts;

export const useContractWrite = ({ address, abi, functionName, args }) => {
  const config = {
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
  };

  const { data, status, error, isPending, isSuccess, writeContract } =
    useWriteContract();

  const { status: txStatus } = useWaitForTransactionReceipt({
    hash: data,
  });

  const write = async () => {
    writeContract(config);
  };

  useEffect(() => {
    if (error) {
      const message = error.message.includes("User rejected")
        ? "Транзакция отклонена"
        : error.message.includes("The total cost")
        ? "Недостаточно средств на балансе"
        : error.message.includes("Connector not connected")
        ? "Требуется подключение кошелька"
        : error.message.includes("allowance")
        ? "Необходимо одобрить токен"
        : error.message.includes("unknown error")
        ? "Неизвестная ошибка"
        : error.message;

      toast.dismiss();
      notifyError(message);
      return;
    }

    const timeout = setTimeout(() => {
      if (isPending) {
        toast.dismiss();
        notifyInfo("Подпишите транзакцию в кошельке");
      }
    }, 500);

    if (isSuccess && txStatus !== "success") {
      toast.dismiss();
      notifySuccess("Транзакция отправлена на обработку");
    }

    if (txStatus === "success") {
      toast.dismiss();
      notifySuccess("Транзакция успешно завершена");
    }

    return () => clearTimeout(timeout);
  }, [error, isPending, isSuccess, txStatus]);

  return {
    data,
    status,
    txStatus,
    error,
    write,
  };
};

export const useBuyWrite = ({ tokenAddress, amount }) =>
  useContractWrite({
    address: XDAO.address,
    abi: XDAO.abi,
    functionName: "buy",
    args: [tokenAddress, amount, true],
  });

export const useApproveWrite = ({ tokenAddress, spender, amount }) =>
  useContractWrite({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
  });
