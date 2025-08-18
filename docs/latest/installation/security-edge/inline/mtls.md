# mTLS for Edge Node to Origins <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Mutual TLS (mTLS) allows the Wallarm Edge Node to authenticate itself to your origin servers using a client certificate. This ensures that your origins accept requests only from trusted sources.

When [configuring Security Edge](deployment.md), you can generate and upload client certificates for the Edge Nodes.

## How it works

When mTLS is enabled for an origin:

1. Before forwarding filtered traffic to your origin, the Edge Node presents a client certificate during the TLS handshake.
1. The origin verifies the certificate against a trusted CA (Certificate Authority) bundle.
1. If the certificate is valid and matches the expected parameters (e.g., Common Name or Subject Alternative Name), the connection is established and the request is accepted.

![!](../../../images/waf-installation/security-edge/inline/mtls-logic.png)

## Enabling mTLS

You can upload multiple certificates and assign different ones to different origins.

1. Generate a client certificate and private key pair, signed by a trusted CA. They must meet the following requirements:

    * **Client certificate**: X.509, PEM format.

        Must include the `Extended Key Usage (EKU)` extension set to `Client Authentication`.
    
    * **Private key**: PEM format, must correspond to the client certificate.
    * **CA bundle**: PEM format, must include the issuing certificate authority for the client certificate.
1. In Wallarm Console → **Security Edge** → **Configure**, under **General settings**, upload the certificate, private key, and CA bundle.
1. In the **Origins** section, enable **Require mTLS from Edge Node** for the relevant origin and select the appropriate certificate.

    Each origin can use a different certificate if needed.
1. **Save** the settings.
1. Configure your origin to require mTLS for incoming connections. Trust the CA bundle used to issue the client certificate.

![!](../../../images/waf-installation/security-edge/inline/mtls-settings-ui.png)
