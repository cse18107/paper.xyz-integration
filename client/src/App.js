import "./App.css";
import { useState, useEffect } from "react";
import {
  PayWithCard,
  PaperSDKProvider,
  CreateWallet,
  VerifyOwnershipWithPaper,
} from "@paperxyz/react-client-sdk";
import ImgLogo from "./images/452c2c256ca56e61a32b131e19d22ab0.png";
import PayLogo from "./images/2f243np.jpg";

function App() {
  const [emailAddress, setEmailAddress] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [paperCheckoutId, setPaperCheckoutId] = useState();
  const [message, setMessage] = useState();
  const [showPayWithCard, setShowPayWithCard] = useState();
  const [contractChain,setContractChain] = useState("");
  const [contractAddress,setContractAddress] = useState("");
  const [contractType,setContractType] = useState("");
  const [collectionTitle,setCollectionTitle] = useState("");
  const [priceValue,setPriceValue] = useState("");
  const [priceCurrency,setPriceCurrency] = useState("");
  const [successCallbackUrl,setSuccessCallbackUrl] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     // Fetch the Paper checkout ID from your backend
  //     const checkoutFetch = await fetch(
  //       "http://localhost:4500/api/paper/checkout",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           // Potentially some params you want to pass to tell
  //           // your backend which Paper checkout you want to get.
  //         }),
  //       }
  //     );
  //     const { checkoutId } = await checkoutFetch.json();
  //     console.log(checkoutId);
  //     setPaperCheckoutId(checkoutId);
  //   })();
  // }, []);

  const onPayWithCardTransferSuccess = (result) => {
    setMessage(`Transaction succeeded!`);
  };

  const onPayWithCardError = (paperSDKerror) => {
    setMessage(
      `Something went wrong! ${paperSDKerror.code}: ${paperSDKerror.error}`
    );
  };

  const onCreateWalletSuccess = (paperUser) => {
    console.log(paperUser);
    setWalletAddress(paperUser.walletAddress);
    setEmailAddress(paperUser.emailAddress);
    setShowPayWithCard(true);
  };

  const onCreateWalletError = (error) => {
    setMessage(`Your email could not be verified.`);
  };

  const submitCreateCheckoutDetails = async () => {
    const response = await fetch("http://localhost:4500/api/paper/checkout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        contractChain,
        contractAddress,
        contractType,
        collectionTitle,
        priceValue,
        priceCurrency,
        successCallbackUrl,
      }),
    });
      const { checkoutId } = await response.json();
      console.log(checkoutId);
      setPaperCheckoutId(checkoutId);
  }

  const onSuccessLogin = async (code) => {
    console.log(code);
    // code is the temporary access code that you can swap for a permenant user access token
    const resp =
      code &&
      (await fetch("http://localhost:4500/api/get-user-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          code,
        }),
      }));

    if (resp.status !== 200) {
      console.log("resp", resp);
      throw new Error("Failed to get user token");
    }
    const { userToken } = await resp.json();
    console.log(userToken);
  };

  return (
    <PaperSDKProvider
      chainName="Mumbai"
      // clientId="b42a0c77-ec2c-4fc4-a2e8-99d38fc66d12"
    >
      <div className="body">
        <div className="container">
          <div className="img-logo">
            <img src={ImgLogo} alt="logo" />
          </div>
          {/* <VerifyOwnershipWithPaper onSuccess={onSuccessLogin} /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: "60%",
            }}
          >
            <input placeholder="CONTRACT CHAIN" onChange={(e)=>{setContractChain(e.target.value)}} />
            <input placeholder="CONTRACT ADDRESS" onChange={(e)=>{setContractAddress(e.target.value)}}  />
            <input placeholder="CONTRACT TYPE" onChange={(e)=>{setContractType(e.target.value)}}  />
            <input placeholder="COLLECTION TITLE" onChange={(e)=>{setCollectionTitle(e.target.value)}}  />
            <input placeholder="PRICE VALUE" onChange={(e)=>{setPriceValue(e.target.value)}}  />
            <input placeholder="PRICE CURRENCY" onChange={(e)=>{setPriceCurrency(e.target.value)}}  />
            <input placeholder="SUCCESS CALLBACK URL" onChange={(e)=>{setSuccessCallbackUrl(e.target.value)}}  />
            <button onClick={submitCreateCheckoutDetails}>SUBMIT</button>
          </div>
          <input
            placeholder="Email address"
            onChange={(e) => {
              setEmailAddress(e.target.value);
            }}
          />
          <CreateWallet
            emailAddress={emailAddress}
            onSuccess={onCreateWalletSuccess}
            onError={onCreateWalletError}
          />
          {/* {paperCheckoutId + walletAddress + emailAddress} */}
          <div>Checkout ID: {paperCheckoutId}</div>
          <div>Wallet Address: {walletAddress}</div>
          <div>Email Address: {emailAddress}</div>
        </div>
        <div className="payment-container">
        <img src={PayLogo} alt="logo"/>
          <div className="payment-contain">
            
            {showPayWithCard && (
              <PayWithCard
                // checkoutId="cc7d8ad4-70c1-46ca-9754-fc3580c49a6c"
                // recipientWalletAddress="0x927a5D4d0e720379ADb53a895f8755D327faF0F5"
                // emailAddress="soumodeepmaity988@gmail.com"
                checkoutId={paperCheckoutId}
                recipientWalletAddress={walletAddress}
                emailAddress={emailAddress}
                onTransferSuccess={onPayWithCardTransferSuccess}
                onError={onPayWithCardError}
                options={{
                  // colorBackground: "#ffffff",
                  border:"none",
                  outLine:"none",
                  colorPrimary: "#42ff4f",
                  colorText: "#232323",
                  borderRadius: 6,
                  fontFamily: "Open Sans",
                }}
              />
            )}

            {message}
          </div>
        </div>
      </div>
    </PaperSDKProvider>
  );
}

export default App;
