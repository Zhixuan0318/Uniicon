import { paymentMiddleware } from "x402-next";

const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL;
const payTo = process.env.RESOURCE_WALLET_ADDRESS;
const network = process.env.NETWORK;

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/protected": {
      price: "$0.01",
      network,
      config: {
        description: "Access to protected content",
      },
    },
  },
  {
    url: facilitatorUrl,
  }
);

export const config = {
  matcher: ["/api/protected/:path*"],
};
