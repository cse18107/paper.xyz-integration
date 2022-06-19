const express = require('express');
const fetch = require("node-fetch");
const router = express.Router();


router.route('/get-user-token').post(async (req, res) => {
    
    if (req.method !== "POST") {
      return res.status(404).json({ error: "Method not allowed" });
    }
    const body = req.body;
    const code = body.code;
    
    const resp = await fetch("https://paper.xyz/api/v1/oauth/token", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer d620a6aa-a17a-4908-a017-e199d88dbdc5",
      },
      body: JSON.stringify({
        code,
        clientId: "05b75a8a-3995-472f-b866-b0ee509f2edf",
      }),
    });
  
    if (resp.status !== 200) {
      return res.status(500).json({ error: "Error getting user token" });
    }
    const { userToken } = await resp.json();
  
    return res.status(200).json({ userToken });
  });


  router.route('/paper/checkout').post( async (req, res) => {
    try {
      console.log(req.body);
      const paperCheckoutResp = await fetch(`https://paper.xyz/api/v1/checkout`, {
        method: "post",
        headers: {
          Authorization: `Bearer d620a6aa-a17a-4908-a017-e199d88dbdc5`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // contractChain: "Rinkeby",
          // contractAddress: "0x1345E35f96060Dc01541923C2Aa183a9a106182F",
          // contractType: "THIRDWEB_NFT_DROP_V2",
          // collectionTitle: "Collection6",
          // priceValue: 0.004,
          // priceCurrency: "ETH",
          // successCallbackUrl: "http://localhost:3000/",
          contractChain: req.body.contractChain,
          contractAddress: req.body.contractAddress,
          contractType: req.body.contractType,
          collectionTitle: req.body.collectionTitle,
          priceValue: req.body.priceValue,
          priceCurrency: req.body.priceCurrency,
          successCallbackUrl: req.body.successCallbackUrl,
        }),
      });
      const response = await paperCheckoutResp.json();
      
      const checkoutId = response.result.id;
  
      return res.status(200).json({
        checkoutId,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  })

module.exports=router;