import { useEffect, useRef, useState } from "react";

import QRCode from "react-qr-code";
import { WalletSDK } from "@roninnetwork/wallet-sdk";
import { isMobile } from "react-device-detect";
import { EIP1193Provider } from "@roninnetwork/wallet-sdk";

type RoninWalletProvider = {
    disconnect: () => void;
} & EIP1193Provider;

export default function Connect() {
    const [userAddress, setUserAddress] = useState();
    const [uri, setUri] = useState();
    const sdk = useRef<WalletSDK | any>();

    useEffect(() => {
        sdk.current = new WalletSDK({
            mobileOptions: { walletConnectProjectId: "d2ef97836db7eb390bcb2c1e9847ecdc" },
        });
    }, []);

    useEffect(() => {
        if (sdk.current) {
            alert("ok");
            // sdk.current.disconnect();
            const provider = sdk.current.getProvider() as RoninWalletProvider;
            console.log(provider);
            // provider.disconnect();
        }
    }, [sdk]);

    async function connectRoninWallet() {
        if (!sdk.current) {
            alert("SDK is not ready");
        }

        sdk.current.on("display_uri", (wcUri: any) => {
            setUri(wcUri);
        });
        // await sdk.current.connectMobile();
        await sdk.current.connect();

        // const accounts = await sdk.current.getAccounts();
        // if (accounts) {
        //     setUserAddress(accounts[0]);
        // }
        const accounts = await sdk.current.requestAccounts();
        setUserAddress(accounts[0]);
    }

    if (userAddress === undefined) {
        return (
            <div>
                {uri && isMobile && sdk.current && (
                    <a href={sdk.current.getDeeplink()}>Open mobile app</a>
                )}
                {uri && !isMobile && (
                    <>
                        <div>Scan me:</div> <QRCode value={uri} />
                    </>
                )}
                {!uri && <button onClick={connectRoninWallet}>Connect Ronin Wallet</button>}
            </div>
        );
    }

    if (userAddress) {
        return `🎉 Ronin Wallet is connected, current address: ${userAddress}`;
    }
}
