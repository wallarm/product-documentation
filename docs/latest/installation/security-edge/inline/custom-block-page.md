[customize-page]: ../../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page

# Block Page in Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

!!! info "Version requirements"
    Returning a block page is supported starting from Edge Node version 5.3.16-2.

When the Security Edge Inline Node blocks a malicious request, it returns a block page along with an HTTP 403 Forbidden response. You can choose from 3 types of block pages:

* Standard - the default NGINX 403 Forbidden page (selected by default)
* Wallarm page - a Wallarm-branded page with blocked request details and HTTP 403
* Custom - your own uploaded HTML page

## Enabling the Wallarm block page

The Wallarm-branded block page provides a user-friendly message that the request was blocked:

![Wallarm block page](../../../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

This page is preloaded. You can enable it without uploading anything.

## Enabling a custom block page

To enable a custom block page, first upload it and then select it during or after Edge Node deployment.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Block pages**.
1. Upload your custom HTML file. It must:

    * Be a single HTML file (maximum size: 1 MB, UTF-8 encoded).
    * Contain only inline CSS and embedded images. 
    * Not rely on relative or external image paths (they may not work). 

    If you do not have a file, you can download the Wallarm block page as a starting point and then [customize][customize-page] it.

1. The uploaded page appears in the list. You can preview it to confirm it renders correctly.
1. To enable the custom page, go to the "Hosts" section. Under "Block page", select "Custom" and choose the name of the uploaded page.



