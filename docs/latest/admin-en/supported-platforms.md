[link-wallarm-account-eu]:         https://my.wallarm.com
[link-wallarm-account-us]:         https://us1.my.wallarm.com

[link-doc-nginx-overview]:      installation-nginx-overview.md

[link-ig-ingress-nginx]:        installation-kubernetes-en.md
[link-ig-ingress-nginx-d2iq]:   https://docs.d2iq.com/ksphere/konvoy/partner-solutions/wallarm/
[link-ig-aws]:                  installation-ami-en.md
[link-ig-gcloud]:               installation-gcp-en.md
[link-ig-docker-nginx]:         installation-docker-en.md
[link-ig-kong]:                 installation-kong-en.md

# Supported platforms

The Wallarm WAF node can be installed on the following platforms:

| Platform                                                                                               | Installation options                  |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| NGINX `stable` installed on the 64-bit operating system from the list:<ul><li>Debian 9.x (stretch)</li><li>Debian 10.x (buster)</li><li>Ubuntu 16.04 LTS (xenial)</li><li>Ubuntu 18.04 LTS (bionic)</li><li>Ubuntu 20.04 LTS (focal)</li><li>CentOS 7.x</li><li>CentOS 8.x</li><li>Amazon Linux 2</li></ul> | <ul><li>[Module for NGINX `stable` from the NGINX repository](../waf-installation/nginx/dynamic-module.md)</li><li>[Module for NGINX `stable` from the Debian/CentOS repository](../waf-installation/nginx/dynamic-module-from-distr.md)</li></ul>                                                                                                                                              |
| NGINX Plus                                                                                             | <ul><li>[Module for NGINX Plus](../waf-installation/nginx-plus.md)</li></ul>                                                                                                        |
| Docker                                                                                                 | <ul><li>[Docker container with NGINX modules](installation-docker-en.md)</li><li>[Docker container with Envoy modules](installation-guides/envoy/envoy-docker.md)</li></ul>           |
| Kubernetes platform version 1.20 and lower                                                                              | <ul><li>[NGINX Ingress controller][link-ig-ingress-nginx]<br>You can deploy the Ingress controller on the Konvoy by D2IQ (formerly Mesosphere). The instructions mentioned above are suitable if you are deploying the Ingress controller with integrated Wallarm WAF services on the Konvoy. However, you may want to look at the [D2IQ's installation instructions][link-ig-ingress-nginx-d2iq].</li><li>[Sidecar container](installation-guides/kubernetes/wallarm-sidecar-container.md)</li></ul>                                                                                                                                         |
| Cloud platforms                                                                                        | <ul><li>[AWS image](installation-ami-en.md)</li><li>[Google Cloud Platform image](installation-gcp-en.md)</li><li>[Yandex.Cloud image](installation-guides/install-in-yandex-cloud.md)</li></ul>                                                                                                                                              |
| Kong 1.4.3 and lower installed on the 64-bit operating system from the list:<br><ul><li>Debian 9.x (stretch)</li><li>Ubuntu 16.04 LTS (xenial)</li><li>Ubuntu 18.04 LTS (bionic)</li><li>CentOS 7.x</li></ul>                                            | <ul><li>[Module for Kong][link-ig-kong]</li></ul>                                                                                                                                         |
