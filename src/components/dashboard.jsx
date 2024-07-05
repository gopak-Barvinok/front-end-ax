import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";

import bitcoinLogo from "../assets/images/bitcoin-logo.svg";
import greenbitcoinlogo from "../assets/images/logo2.svg";
import dashboardicon from "../assets/images/dashboard_icon.svg";
import ellipse_one from "../assets/images/ellipse_one.svg";
import ellipse_two from "../assets/images/ellipse_two.svg";
import ellipse_three from "../assets/images/ellipse_three.svg";
import ellipse_fore from "../assets/images/ellipse_fore.svg";
import token_icon from "../assets/images/token_icon.svg";
import down_chevron from "../assets/images/down_chevron.svg";
import vector from "../assets/images/vector.svg";
import parameters_vector from "../assets/images/parameters_vector.svg";
import parameters_one from "../assets/images/parameters_one.svg";
import parameters_two from "../assets/images/parameters_two.svg";
import parameters_three from "../assets/images/parameters_three.svg";
import parameters_fore from "../assets/images/parameters_fore.svg";
import upward_shift from "../assets/images/upward_shift.svg";
import left_green_circle from "../assets/images/left_green_circle.png";
import vector_smart_object from "../assets/images/vector_smart_object.svg";
import React from "react";
import ellipse_one_mobile from "../assets/images/ellipse_one_mobille.png";
import ellipse_two_mobile from "../assets/images/ellipse_two_mobile.png";

import { CustomConnectButton } from "./CustomConnect";
import {
  useSaleInfo,
  useBalanceOf,
  useDecimals,
  useAllowance,
  useRegularFeeRate,
  useTotalSupply
} from "../hooks/useContactRead";
import {
  contracts,
  AAVEWBTCOwner,
  CURRENT_DAO_INDEX,
} from "../utils/blockchain";
import { useApproveWrite, useBuyWrite } from "../hooks/useContractWrite";
import { toOptionalFixed } from "../utils/converter";
import axios from "axios";

const Dashboard = () => {
  const [amount, setAmount] = useState(0);
  const [receive, setReceive] = useState(0);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const [axBTCResponse, setAxBTCResponse] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { XDAO, XDAOToken, AxiomToken, LPToken, WBTCToken, AAVEWBTCToken } =
    contracts;

  const requiredXDAOTokens = 5000000000000000000;

  const { address, isConnected, chain } = useAccount();

  const saleInfo = useSaleInfo({
    tokenAddress: AxiomToken.address,
    index: CURRENT_DAO_INDEX,
  });

  const feeRate = useRegularFeeRate();

  const WBTCBalance = useBalanceOf({
    tokenAddress: WBTCToken.address,
    owner: !refetch && address,
  });

  const AAVEWBTCTokenBalance = useBalanceOf({
    tokenAddress: AAVEWBTCToken.address,
    owner: AAVEWBTCOwner,
  });

  const wBTCDAOBalance = useBalanceOf({
    tokenAddress: WBTCToken.address,
    owner: AAVEWBTCOwner,
  });


  const lpTokenSupply = useTotalSupply({
    tokenAddress: LPToken.address,
    
  });
  
    console.log("lp token supply " + lpTokenSupply)



  const LPBalanceDAO = useBalanceOf({
    tokenAddress: LPToken.address,
    owner: AAVEWBTCOwner,
  });

  const LPBalance = useBalanceOf({
    tokenAddress: LPToken.address,
    owner: !refetch && address,
  });

  const XDAOTokenBalance = useBalanceOf({
    tokenAddress: XDAOToken.address,
    owner: address,
  });

  const WBTCDecimals = useDecimals({ tokenAddress: WBTCToken.address });

  const AAVEWBTCTokenDecimals = useDecimals({
    tokenAddress: AAVEWBTCToken.address,
  });

  const LPDecimals = useDecimals({ tokenAddress: LPToken.address });

  const WBTCAllowance = useAllowance({
    tokenAddress: WBTCToken.address,
    owner: !refetch && address,
    spender: XDAO.address,
  });

  const XDAOTokenConditions = useMemo(() => {
    return XDAOTokenBalance >= requiredXDAOTokens;
  }, [XDAOTokenBalance, requiredXDAOTokens]);

  const formattedWBTCBalance = useMemo(() => {
    return WBTCBalance !== undefined && WBTCDecimals
      ? formatUnits(WBTCBalance, WBTCDecimals)
      : undefined;
  }, [WBTCBalance, WBTCDecimals]);

  const formattedAAVEWBTCTokenBalance = useMemo(() => {
    console.log("AAVEWBTCTokenBalance " + AAVEWBTCTokenBalance);
    // console.log("formattedAAVEWBTCTokenBalance" + formattedAAVEWBTCTokenBalance)

    return AAVEWBTCTokenBalance !== undefined && AAVEWBTCTokenDecimals
      ? formatUnits(AAVEWBTCTokenBalance, AAVEWBTCTokenDecimals)
      : undefined;
  }, [AAVEWBTCTokenBalance, AAVEWBTCTokenDecimals]);


  const formattedLPBalance = useMemo(() => {
    return LPBalance !== undefined && LPDecimals
      ? formatUnits(LPBalance, LPDecimals)
      : undefined;
  }, [LPBalance, LPDecimals]);

  const fetchInitialData = async () => {
    const backEndUrl= process.env.REACT_APP_BACK_END_URL;
    try {
      const response = await axios.get(backEndUrl);
      console.log(response);
      setAxBTCResponse(response.data.result);
      if(response.status === 200) {
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Error: ' + e);
      setAxBTCResponse('Error');
    }
  }

  useEffect(() => {
    fetchInitialData();

    const interval = setInterval(() => {
      fetchInitialData();
    }, 36000000);

    return () => clearInterval(interval); 
  }, []);


  const parsedAmount = useMemo(() => {
    if (!WBTCDecimals) return undefined;
    if (isNaN(amount) || amount <= 0) return undefined;

    const minAmount = 1 / Math.pow(10, WBTCDecimals);
    if (amount < minAmount) {
      // console.warn(
      //   `Amount ${amount} is too small to convert with ${WBTCDecimals} decimals.`
      // );
      return undefined;
    }

    try {
      return parseUnits(String(amount), WBTCDecimals);
    } catch (error) {
      // console.error(
      //   `Failed to parse amount: ${amount} with decimals: ${WBTCDecimals}`,
      //   error
      // );
      return undefined;
    }
  }, [amount, WBTCDecimals]);

  const formattedSharePrice = useMemo(() => {
    
    console.log("formattedSharePrice: dao address " + AAVEWBTCOwner)



    const totalBTCBalance = AAVEWBTCTokenBalance + wBTCDAOBalance 
    const LPBalance = lpTokenSupply - LPBalanceDAO;
    const displayShare = totalBTCBalance / LPBalance;

    console.log("formattedSharePrice: AAVEWBTCTokenBalance " + AAVEWBTCTokenBalance);
    console.log("formattedSharePrice: wBTCDAOBalance " + wBTCDAOBalance);
    console.log("formattedSharePrice: total btc balance " + totalBTCBalance);
    console.log("formattedSharePrice: lpTokenSupply " + lpTokenSupply);
    console.log("formattedSharePrice: LPBalance " + LPBalance);
    console.log("formattedSharePrice: lp balance dao " + LPBalanceDAO)
    console.log("formattedSharePrice: displayShare " + displayShare);
    
    return displayShare !== undefined && AAVEWBTCTokenDecimals
      ? formatUnits(displayShare, AAVEWBTCTokenDecimals)
      : undefined;
  },);

  // const formattedSharePrice = useMemo(() => {
  //   console.log("dao address " + AAVEWBTCOwner)
  //   console.log("formattedSharePrice: AAVEWBTCTokenBalance " + AAVEWBTCTokenBalance);
  //   console.log("formattedSharePrice: wBTCDAOBalance " + wBTCDAOBalance);

  //   let totalBTCBalance;
  //   if(AAVEWBTCTokenBalance && wBTCDAOBalance) {
  //     totalBTCBalance = AAVEWBTCTokenBalance + wBTCDAOBalance; 
  //   }
  //   console.log("formattedSharePrice: totalBTCBalance " + totalBTCBalance);

  //   let LPBalance;
  //   if(lpTokenSupply && LPBalanceDAO) {
  //     LPBalance = lpTokenSupply - LPBalanceDAO;
  //   }
  //   console.log("LPBalance: " + LPBalance);
  // }, [totalBTCBalance])

  // let finalValue;

  // const newCalculateSharePrice= useMemo(() => {
    
  //   console.log("dao address " + AAVEWBTCOwner)



  //   // const totalBTCBalance = AAVEWBTCTokenBalance + wBTCDAOBalance 
    
  //   // const LPBalance = lpTokenSupply - LPBalanceDAO;

  //   // const displayShare = totalBTCBalance / LPBalance;


  //   // console.log("AAVEWBTCTokenBalance " + AAVEWBTCTokenBalance);
  //   // console.log("wBTCDAOBalance " + wBTCDAOBalance);
  //   // console.log("total btc balance " + totalBTCBalance);
  //   // console.log("lpTokenSupply " + lpTokenSupply);
  //   // console.log("LPBalance " + LPBalance);
  //   // console.log("lp balance dao " + LPBalanceDAO)
  //   // console.log("displayShare " + displayShare);


  //   const totalBTCBalance = AAVEWBTCTokenBalance  


    
  //   const finalValue = totalBTCBalance

  //   console.log("newTotalBTCBalance " + totalBTCBalance)




  //   return finalValue !== undefined && AAVEWBTCTokenDecimals
  //     ? formatUnits(finalValue, AAVEWBTCTokenDecimals)
  //     : undefined;
  // }, [finalValue]);




  

  const {
    data: approveData,
    status: approveStatus,
    txStatus: approveTxStatus,
    write: approveWrite,
  } = useApproveWrite({
    tokenAddress: WBTCToken.address,
    spender: XDAO.address,
    amount: parsedAmount,
  });

  const {
    data: buyData,
    status: buyStatus,
    txStatus: buyTxStatus,
    write: buyWrite,
  } = useBuyWrite({
    tokenAddress: AxiomToken.address,
    amount: parsedAmount,
  });

  const approveText = useMemo(() => {
    if (
      approveStatus === "pending" ||
      (approveData && approveTxStatus !== "success")
    ) {
      return "Транзакция в процессе...";
    } else return "Одобрить axBTC";
  }, [approveStatus, approveData, approveTxStatus]);

  const buyText = useMemo(() => {
    if (buyStatus === "pending" || (buyData && buyTxStatus !== "success")) {
      return "Транзакция в процессе...";
    } else return "Обменять";
  }, [buyStatus, buyData, buyTxStatus]);

  const handleSwitch = () => {
    // const _amount = amount;
    // const _receive = receive;

    // setAmount(_receive);
    // setReceive(_amount);
    setIsSwitched((prev) => !prev);
  };

  const handleMax = () => {
    if (isSwitched) {
      setReceive(
        formattedLPBalance ? toOptionalFixed(formattedLPBalance, 8) : 0
      );

      if (saleInfo && feeRate && formattedLPBalance) {
        const fee = feeRate / 100;
        const _amount =
          (((formattedLPBalance * 10 ** WBTCDecimals) /
            Number(saleInfo?.rate)) *
            (100 - fee)) /
          100;
        setAmount(toOptionalFixed(_amount, 8));
      }
    } else {
      setAmount(formattedWBTCBalance);

      if (saleInfo && feeRate && formattedWBTCBalance) {
        const fee = feeRate / 100;
        const _receive =
          (((formattedWBTCBalance * 10 ** WBTCDecimals) /
            Number(saleInfo?.rate)) *
            (100 - fee)) /
          100;
        setReceive(toOptionalFixed(_receive, 8));
      }
    }
  };

  const handleChangeAmount = (e) => {
    const _amount = e.target.value;

    if (_amount < 0) {
      setAmount(0);
      return;
    }

    setAmount(_amount);

    if (_amount === "") {
      setReceive(0);
    }
    if (saleInfo && feeRate && _amount) {
      const fee = feeRate / 100;
      const _receive = isSwitched
        ? (((_amount * Number(saleInfo?.rate)) / 10 ** WBTCDecimals) *
            (100 + fee)) /
          100
        : (((_amount * 10 ** WBTCDecimals) / Number(saleInfo?.rate)) *
            (100 - fee)) /
          100;
      setReceive(toOptionalFixed(_receive, 8));
    }
  };

  const handleChangeReceive = (e) => {
    const _receive = e.target.value;

    if (_receive < 0) {
      setReceive(0);
      return;
    }

    setReceive(_receive);

    if (_receive === "") {
      setAmount(0);
    }

    if (saleInfo && feeRate && _receive) {
      const fee = feeRate / 100;
      const _amount = isSwitched
        ? (((_receive * 10 ** WBTCDecimals) / Number(saleInfo?.rate)) * 100) /
          (100 + fee)
        : (((_receive * Number(saleInfo?.rate)) / 10 ** WBTCDecimals) * 100) /
          (100 - fee);
      setAmount(toOptionalFixed(_amount, 8));
    }
  };

  useEffect(() => {
    if (isSwitched) {
      if (saleInfo && feeRate && amount) {
        const fee = feeRate / 100;
        const _receive =
          (((amount * Number(saleInfo?.rate)) / 10 ** WBTCDecimals) *
            (100 + fee)) /
          100;
        setReceive(toOptionalFixed(_receive, 8));
      }
    } else {
      if (saleInfo && feeRate && receive) {
        const fee = feeRate / 100;
        const _receive =
          (((amount * 10 ** WBTCDecimals) / Number(saleInfo?.rate)) *
            (100 - fee)) /
          100;
        setReceive(toOptionalFixed(_receive, 8));
      }
    }
  }, [isSwitched]);

  useEffect(() => {
    if (
      approveStatus === "success" &&
      approveData &&
      approveTxStatus === "success"
    ) {
      buyWrite();
    }
  }, [approveStatus, approveData, approveTxStatus]);

  useEffect(() => {
    if (
      approveStatus === "pending" ||
      (approveData && approveTxStatus !== "success") ||
      buyStatus === "pending" ||
      (buyData && buyTxStatus !== "success")
    ) {
      setIsTxLoading(true);
    } else {
      setIsTxLoading(false);
      setRefetch(true);
      setTimeout(() => {
        setRefetch(false);
      }, 100);
    }
  }, [
    approveStatus,
    approveData,
    approveTxStatus,
    buyStatus,
    buyData,
    buyTxStatus,
  ]);

  return (
    <>
      <section id="dashboard" className="dashboard">
        <div className="wrapper">
          <div className="dashboard-conteiner">
            <div className="dashboard-conteiner-title">
              <h1 style={{fontWeight:"800"}} >Мой дашборд</h1>
              <div className="dashboard-conteiner-title-line"></div>
            </div>
            <div className="dashboard-conteiner-content">
              <div className="conteiner-content-briefcase">
                <h2>Инвестиционный портфель</h2>
                <img src={dashboardicon} alt="" />
                <div className="content-briefcase-ellips">
                  <img className="ellipse_one" src={ellipse_one} alt="" />
                  <img className="ellipse_two" src={ellipse_two} alt="" />
                  <img className="ellipse_three" src={ellipse_three} alt="" />
                  <img className="ellipse_fore" src={ellipse_fore} alt="" />
                </div>
              </div>
              <div className="conteiner-content-deal">
                <h2>Быстрая сделка</h2>
                <div className="content-deal">
                  <div className="content-deal-input">
                    {isSwitched ? (
                      <>
                        <div className="deal-input">
                          <div className="deal-input-content">
                            <input
                              value={receive}
                              type="number"
                              readOnly={isTxLoading}
                              min={0}
                              onChange={handleChangeReceive}
                            />
                            {/* <p>7 533,10 USD</p> */}
                          </div>
                          <div className="deal-select">
                            <div className="deal-select-token">
                              <img
                                src={greenbitcoinlogo}
                                alt=""
                                height={63}
                                width={63}
                              />
                              <p>axBTC</p>
                            </div>
                            <img
                              className="down-chevron"
                              src={down_chevron}
                              alt=""
                            />
                          </div>
                        </div>
                        {isConnected && chain ? (
                          <h3>
                            На кошельке:{" "}
                            {formattedLPBalance !== undefined ? (
                              <>
                                {toOptionalFixed(formattedLPBalance, 8)}
                                <span> axBTC </span>
                                <button
                                  onClick={handleMax}
                                  className="max-button"
                                >
                                  Max
                                </button>
                              </>
                            ) : (
                              "-"
                            )}
                          </h3>
                        ) : (
                          <div style={{ height: "1vw" }} />
                        )}

                        <img
                          className="vector"
                          src={vector}
                          alt=""
                          onClick={handleSwitch}
                        />
                        <div className="deal-input">
                          <div className="deal-input-content">
                            <input
                              value={amount}
                              type="number"
                              readOnly={isTxLoading}
                              min={0}
                              onChange={handleChangeAmount}
                            />
                            {/* <p>700,0 USD</p> */}
                          </div>
                          <div className="deal-select">
                            <div className="deal-select-token">
                              <img
                                src={bitcoinLogo}
                                alt=""
                                height={63}
                                width={63}
                              />
                              <p>wBTC</p>
                            </div>
                            <img
                              className="down-chevron"
                              src={down_chevron}
                              alt=""
                            />
                          </div>
                        </div>
                        {isConnected && chain ? (
                          <h3>
                            На кошельке:{" "}
                            {formattedWBTCBalance !== undefined ? (
                              <>
                                {toOptionalFixed(formattedWBTCBalance, 8)}
                                <span> wBTC</span>
                              </>
                            ) : (
                              "-"
                            )}
                          </h3>
                        ) : (
                          <div style={{ height: "1vw" }} />
                        )}
                      </>
                    ) : (
                      <>
                        <div className="deal-input">
                          <div className="deal-input-content">
                            <input
                              value={amount}
                              type="number"
                              readOnly={isTxLoading}
                              min={0}
                              onChange={handleChangeAmount}
                            />
                            {/* <p>700,0 USD</p> */}
                          </div>
                          <div className="deal-select">
                            <div className="deal-select-token">
                              <img
                                src={bitcoinLogo}
                                alt=""
                                height={63}
                                width={63}
                              />
                              <p>wBTC</p>
                            </div>
                            <img
                              className="down-chevron"
                              src={down_chevron}
                              alt=""
                            />
                          </div>
                        </div>

                        {isConnected && chain ? (
                          <h3>
                            На кошельке:{" "}
                            {formattedWBTCBalance !== undefined ? (
                              <>
                                {toOptionalFixed(formattedWBTCBalance, 8)}
                                <span> wBTC </span>
                                <button
                                  onClick={handleMax}
                                  className="max-button"
                                >
                                  Max
                                </button>
                              </>
                            ) : (
                              "-"
                            )}
                          </h3>
                        ) : (
                          <div style={{ height: "1vw" }} />
                        )}
                        <img
                          className="vector"
                          src={vector}
                          alt=""
                          onClick={() => setIsSwitched((prev) => !prev)}
                        />
                        <div className="deal-input">
                          <div className="deal-input-content">
                            <input
                              value={receive}
                              type="number"
                              readOnly={isTxLoading}
                              min={0}
                              onChange={handleChangeReceive}
                            />
                            {/* <p>7 533,10 USD</p> */}
                          </div>
                          <div className="deal-select">
                            <div className="deal-select-token">
                              <img
                                src={greenbitcoinlogo}
                                alt=""
                                height={63}
                                width={63}
                              />
                              <p>axBTC</p>
                            </div>
                            <img
                              className="down-chevron"
                              src={down_chevron}
                              alt=""
                            />
                          </div>
                        </div>

                        {isConnected && chain ? (
                          <h3>
                            На кошельке:{" "}
                            {formattedLPBalance !== undefined ? (
                              <>
                                {toOptionalFixed(formattedLPBalance, 8)}
                                <span> axBTC</span>
                              </>
                            ) : (
                              "-"
                            )}
                          </h3>
                        ) : (
                          <div style={{ height: "1vw" }} />
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="conteiner-content-button">
                  {isConnected && chain ? (
                    !XDAOTokenConditions ? (
                      <button className="content-button inactive">
                        Требуется 5 XDAO
                      </button>
                    ) : isSwitched ? (
                      <button className="content-button inactive">
                        Only buy actions now
                      </button>
                    ) : parsedAmount > WBTCBalance ? (
                      <button className="content-button inactive">
                        Недостаточно axBTC
                      </button>
                    ) : WBTCAllowance < parsedAmount ? (
                      <button
                        className="content-button"
                        disabled={isTxLoading}
                        onClick={() => approveWrite()}
                      >
                        {approveText}
                      </button>
                    ) : (
                      <button
                        className={`content-button ${
                          !parsedAmount ? "inactive" : ""
                        } `}
                        disabled={!parsedAmount || isTxLoading}
                        onClick={() => buyWrite()}
                      >
                        {buyText}
                      </button>
                    )
                  ) : (
                    <CustomConnectButton />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="parameters-conteiner">
            <div className="parameters-conteiner-vector">
              <img src={parameters_vector} alt="" />
            </div>
            <div className="parameters-conteiner-content">
              <div className="content_item">
                <img src={bitcoinLogo} alt="" />
                <h3>
                  axBTC on DAO Contract:{" "}


                  {
                    isLoading ? <p>Loading...</p> : axBTCResponse
                  }
                
                </h3>
              </div>
              {/* <div className="content_item">
                <img src={parameters_two} alt="" />
                <h3>EXC: 29.01%</h3>
              </div>
              <div className="content_item">
                <img src={parameters_three} alt="" />
                <h3>MTV: 29.01%</h3>
              </div>
              <div className="content_item">
                <img src={parameters_fore} alt="" />
                <h3>CLS: 29.01%</h3>
              </div> */}
              <a href="">
                <img className="upward_shift" src={upward_shift} alt="" />
              </a>
            </div>
            <div className="parameters-conteiner-content-mobie">
              <div className="conteiner-content-item">
              <div className="content_item">
                <img src={bitcoinLogo} alt="" />
                <h3>
                  axBTC on DAO Contract:{" "}
                  {
                    isLoading ? <p>Loading...</p> : axBTCResponse
                  }

                </h3>
              </div>
              </div>
            </div>
          </div>
          <img className="left_green_circle" src={left_green_circle} alt="" />
          <img
            className="vector_smart_object"
            src={vector_smart_object}
            alt=""
          />
          <img className="ellipse_one_mobile" src={ellipse_one_mobile} alt="" />
          <img className="ellipse_two_mobile" src={ellipse_two_mobile} alt="" />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
