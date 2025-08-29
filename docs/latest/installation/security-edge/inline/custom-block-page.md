# Block Page in Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

When the Security Edge Inline Node blocks a malicious request, it can return a styled block page along with HTTP 403 Forbidden response.

!!! info "Version requirements"
    Returning a styled block page is supported starting from Edge Node version 5.3.16-2.

## Block page appearance

The styled block page provides a user-friendly notice that the request was blocked:

![Wallarm block page](../../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Enabling the custom block page

The custom block page is enabled by default for starting with version 5.3.16-2.

To control the feature, go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Return styled page for blocked requests**.
