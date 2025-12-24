[nginx-sidecar]:                ../installation/kubernetes/sidecar-proxy/deployment.md
[ssl-termination]:              ../installation/kubernetes/sidecar-proxy/customization.md#ssltls-termination
[nginx-aio]:                    ../installation/inline/compute-instances/linux/all-in-one.md
[nginx-docker]:                 ../admin-en/installation-docker-en.md


# SSL/TLS Certificate Management

This article explains what certificates are required, how to manage certificates, how Wallarm nodes handle HTTPS traffic, and where and how to terminate SSL/TLS.

## Certificate requirements

* Supported format: PEM for both certificate and private key files.
* Key types and sizes: Any key size supported by OpenSSL/NGINX, including 2048-bit, 4096-bit, and ECDSA keys.
* Cipher suites: Defined and managed through standard NGINX/OpenSSL configuration.

## Certificate issuance and management

Wallarm does not issue, manage, or automatically renew certificates. All certificates must be provided and managed by clients.

You need to:

1. Issue a certificate from a trusted Certificate Authority (CA).
1. Deploy the certificate to Wallarm nodes.
1. Renew the certificate before it expires.

To automate these actions, you can use external tools, e.g., [Certbot](https://certbot.eff.org/), [HashiCorp Vault](https://developer.hashicorp.com/vault), [Kubernetes cert-manager](https://cert-manager.io/), [Ansible playbooks](https://docs.ansible.com/projects/ansible/devel/playbook_guide/playbooks_intro.html), or others.

## SSL/TLS termination 

SSL/TLS certificates protect network communications between:

* Wallarm nodes and the Wallarm Cloud
* Wallarm administrators (workstations) and the Wallarm Cloud Console UI and API

By securing these channels, SSL/TLS certificates allow Wallarm to safely decrypt and analyze HTTPS traffic to detect and block threats.

SSL/TLS termination is the process of decrypting encrypted HTTPS traffic at a network endpoint.

Wallarm needs to have decrypted HTTPS traffic to inspect HTTP data (URL, headers, body), detect threats, and block malicious requests.

The configuration and location of SSL/TLS termination depend on your Wallarm [deployment type](../installation/nginx-native-node-internals.md).

### SSL/TLS termination in the NGINX Node

* [Sidecar][nginx-sidecar]

    By default, the Wallarm Sidecar solution does not handle SSL/TLS termination. It expects an upstream component (e.g., Ingress or Application Gateway) to handle HTTPS while the Sidecar solution receives plain, decrypted HTTP.

    However, if your infrastructure cannot terminate SSL/TLS upstream, you can [enable SSL/TLS termination directly in the Wallarm Sidecar][ssl-termination].

* [All-in-one installer][nginx-aio], [Docker image][nginx-docker], and cloud images:

    The NGINX Node handles SSL/TLS termination. In this case, the node acts as an HTTPS endpoint and must be configured with an SSL/TLS certificate and private key. To set up SSL/TLS termination, edit the [NGINX configuration ](https://nginx.org/en/docs/http/configuring_https_servers.html):

    * [`ssl_certificate`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate) - specifies the PEM-format certificate file, including the full certificate chain.
    * [`ssl_certificate_key`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate_key) - specifies the PEM-format private key file.

### SSL/TLS termination in the Native Node

The Native Node **does not handle SSL/TLS termination** and never acts as an inline traffic endpoint. It always analyzes a copy of traffic, not the original client connection.

HTTPS traffic must be decrypted before a copy is sent to the Native Node. SSL/TLS termination is performed by an upstream or adjacent component, e.g., a load balancer, reverse proxy, application delivery controller (ADC), ingress controller, a connector.

The terminating component decrypts HTTPS traffic and sends a decrypted traffic copy to the Native Node for analysis. For configuration details, refer to the documentation of the chosen component.
