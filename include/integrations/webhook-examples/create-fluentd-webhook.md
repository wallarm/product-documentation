* Webhooks are sent to `https://fluentd-example-domain.com`
* Webhooks are sent via POST requests
* Additional authentication parameter `X-Auth-Token` is passed in the request
* Certificate for HTTPS connection to `https://fluentd-example-domain.com` is passed in the request (the certificate is located in the file `/etc/ssl/certs/fluentd.crt` on the Fluentd instance)
* The certificate is additionally verified on the Wallarm side
* Webhooks sent to Webhook URLs are all available events: hits, system events, vulnerabilities, scope changes
