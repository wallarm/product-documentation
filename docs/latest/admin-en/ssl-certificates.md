[nginx-sidecar]:                ../installation/kubernetes/sidecar-proxy/deployment.md
[ssl-termination]:              ../installation/kubernetes/sidecar-proxy/customization.md#ssltls-termination
[nginx-aio]:                    ../installation/inline/compute-instances/linux/all-in-one.md
[nginx-docker]:                 ../admin-en/installation-docker-en.md


# SSL/TLS Termination and Certificate Management

This article explains how and where SSL/TLS termination is performed in Wallarm nodes, including certificate requirements and management.

## SSL/TLS termination

SSL/TLS termination is the process of decrypting HTTPS traffic at a network component (e.g., a proxy or gateway). Wallarm requires decrypted HTTPS traffic to inspect HTTP data (URLs, headers, and request bodies), detect threats, and block malicious requests.

The configuration and location of SSL/TLS termination depend on your Wallarm [deployment type](../installation/nginx-native-node-internals.md).

## SSL/TLS termination in the NGINX Node

* [Sidecar][nginx-sidecar]

    By default, Wallarm Sidecar does not handle SSL/TLS termination. It expects an upstream component (e.g., Ingress or Application Gateway) to handle HTTPS, while Wallarm Sidecar receives decrypted HTTP traffic.

    However, if your infrastructure cannot terminate SSL/TLS upstream, you can [enable SSL/TLS termination directly in Wallarm Sidecar][ssl-termination].

* [All-in-one installer][nginx-aio], [Docker image][nginx-docker], and cloud images:

    The NGINX Node handles SSL/TLS termination. To configure it, you must issue an SSL/TLS certificate for the protected resource, upload the certificate and private key to the NGINX Node, and edit the [NGINX configuration](https://nginx.org/en/docs/http/configuring_https_servers.html).

    To learn more about certificate management when SSL/TLS termination is handled by the NGINX Node, see the section below.

### Certificate issuance and management

Wallarm does not issue, manage, or automatically renew certificates. All certificates must be provided and managed by clients.

You need to:

1. Issue a certificate from a trusted Certificate Authority (CA).

    The certificate must meet the following requirements:

    * Supported format: PEM for both certificate and private key files.
    * Key types and sizes: Any key size supported by OpenSSL/NGINX, including 2048-bit, 4096-bit, and ECDSA keys.
    * Cipher suites: Defined and managed through standard NGINX/OpenSSL configuration.   

1. Upload the certificate file and private key to the Wallarm node.
1. Edit the [NGINX configuration](https://nginx.org/en/docs/http/configuring_https_servers.html):

    * [`ssl_certificate`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate) - specifies the PEM-format certificate file, including the full certificate chain.
    * [`ssl_certificate_key`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate_key) - specifies the PEM-format private key file.

    ??? info "Show sample NGINX configuration"

        ```
        server {
            listen 80;
            server_name test.com;
            return 301 https://$server_name$request_uri;
        }

        server {
            listen 443 ssl;
            listen [::]:443 ssl;
            server_name test.com;

            ssl_certificate /etc/ssl/certs/example_public.crt; 
            ssl_certificate_key /etc/ssl/key/private_example.key;

            set_real_ip_from 11.11.11.11; # Replace with the IP address of the proxy in front of NGINX
            real_ip_header X-Forwarded-For;
            real_ip_recursive on;
            
            wallarm_mode monitoring;
            wallarm_application 100;  

            location / {
                proxy_pass https://10.100.100.30; # Replace with the IP address of the origin server 
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
        }
        ```

1. Monitor the certificate's validity and renew it before expiration.

To automate these actions, you can use external tools, e.g., [Certbot](https://certbot.eff.org/), [HashiCorp Vault](https://developer.hashicorp.com/vault), [Kubernetes cert-manager](https://cert-manager.io/), [Ansible playbooks](https://docs.ansible.com/projects/ansible/devel/playbook_guide/playbooks_intro.html), or others.

## SSL/TLS termination in the Native Node

The Native Node **does not handle SSL/TLS termination** and never acts as an inline traffic endpoint. It always analyzes a copy of traffic, not the original client connection.

HTTPS traffic must be decrypted before a copy is sent to the Native Node. SSL/TLS termination is performed by an upstream or adjacent component, e.g., a load balancer, reverse proxy, application delivery controller (ADC), ingress controller, a connector.

The terminating component decrypts HTTPS traffic and sends a decrypted traffic copy to the Native Node for analysis. For configuration details, refer to the documentation of the chosen component.
