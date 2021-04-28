* Webhooks are sent to `https://192.168.1.65:5044`
* Webhooks are sent via POST requests
* Additional authentication parameter `X-Auth-Token` is passed in the request
* Certificate for HTTPS connection to `https://192.168.1.65:5044` is passed in the request (the certificate is located in the file `/etc/server.crt` on the Logstash instance)
* The certificate is additionally verified on the Wallarm side
* Webhooks sent to Webhook URLs are all available events: hits, system events, vulnerabilities, scope changes
