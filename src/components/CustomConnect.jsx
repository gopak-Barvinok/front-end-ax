import { ConnectButton } from "@rainbow-me/rainbowkit";
export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div style={{ width: "100%" }}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="content-button text"
                    type="button"
                  >
                    Подключить кошелек
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="content-button wrong-network text"
                    type="button"
                  >
                    Неверная сеть
                  </button>
                );
              }
              //   return (
              //     <div style={{ display: "flex", gap: 12 }}>
              //       <button
              //         onClick={openChainModal}
              //         style={{ display: "flex", alignItems: "center" }}
              //         type="button"
              //       >
              //         {chain.hasIcon && (
              //           <div
              //             style={{
              //               background: chain.iconBackground,
              //               width: 12,
              //               height: 12,
              //               borderRadius: 999,
              //               overflow: "hidden",
              //               marginRight: 4,
              //             }}
              //           >
              //             {chain.iconUrl && (
              //               <img
              //                 alt={chain.name ?? "Chain icon"}
              //                 src={chain.iconUrl}
              //                 style={{ width: 12, height: 12 }}
              //               />
              //             )}
              //           </div>
              //         )}
              //         {chain.name}
              //       </button>
              //       <button onClick={openAccountModal} type="button">
              //         {account.displayName}
              //         {account.displayBalance
              //           ? ` (${account.displayBalance})`
              //           : ""}
              //       </button>
              //     </div>
              //   );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
