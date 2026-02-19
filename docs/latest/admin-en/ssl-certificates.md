[nginx-sidecar]:                ../installation/kubernetes/sidecar-proxy/deployment.md
[ssl-termination]:              ../installation/kubernetes/sidecar-proxy/customization.md#ssltls-termination
[nginx-aio]:                    ../installation/inline/compute-instances/linux/all-in-one.md
[nginx-docker]:                 ../admin-en/installation-docker-en.md
[nginx-node]:                   ../installation/nginx-native-node-internals.md#nginx-node
[native-node]:                  ../installation/nginx-native-node-internals.md#native-node
[security-edge]:                ../installation/security-edge/overview.md
[aws-ami]:                      ../installation/inline/compute-instances/aws/aws-ami.md
[gcp]:                          ../installation/inline/compute-instances/gcp/machine-image.md


# TLS Termination and Certificate Management (Self-Hosted Nodes)

This article describes how TLS termination and certificate management work in self-hosted Wallarm nodes (including NGINX and Native Nodes), and how HTTPS traffic is processed for analysis.

Wallarm analyzes HTTP traffic only after TLS decryption. TLS termination can occur on an upstream component or on the Wallarm Node, which determines HTTPS traffic flow and whether certificates must be managed on the Wallarm side.

## HTTPS traffic flow and TLS termination

HTTPS traffic is encrypted and cannot be inspected in its encrypted form. To analyze requests, the traffic must be decrypted at the point of TLS termination.

In Wallarm deployments, TLS termination can be performed either by an upstream component (e.g., a load balancer or Ingress Controller) or by a Wallarm Node.

* If TLS is terminated upstream, Wallarm receives already decrypted traffic and does not require certificates.
* If a Wallarm NGINX Node terminates TLS, certificates must be issued, configured, and maintained on the Wallarm side.

## TLS termination in the NGINX Node

The way TLS termination is handled in the NGINX Node depends on the deployment artifact (Sidecar, all-in-one installer, Docker image, or AWS/GCP cloud image). You can see each case described below.

### Sidecar

By default, [Wallarm Sidecar][nginx-sidecar] does not terminate TLS. It expects an upstream component (e.g., Ingress or Application Gateway) to handle HTTPS, while the Sidecar receives decrypted HTTP traffic.

In this case, the Wallarm Node doesn't need certificates because TLS is terminated upstream. However, if your infrastructure cannot terminate TLS upstream, you can [enable TLS termination directly in Wallarm Sidecar][ssl-termination].

### [All-in-one installer][nginx-aio], [Docker image][nginx-docker], and [AWS][aws-ami]/[GCP][gcp] cloud images

The NGINX Node handles TLS termination. To configure it, you must issue an TLS certificate for the protected resource, upload the certificate and private key to the NGINX Node, and edit the [NGINX configuration](https://nginx.org/en/docs/http/configuring_https_servers.html).

Because the NGINX Node terminates TLS directly, certificate provisioning and lifecycle management are the clients' responsibility. Wallarm does not issue, manage, or automatically renew certificates.

You need to:

1. Issue a certificate from a trusted Certificate Authority (CA) for a Wallarm Node instance.

    The certificate must meet the following requirements:

    * Supported format: PEM for both certificate and private key files.
    * Key types and sizes: Any key size supported by OpenSSL/NGINX, including 2048-bit, 4096-bit, and ECDSA keys.
    * Cipher suites: Defined and managed through standard NGINX/OpenSSL configuration.   

1. Upload the certificate file and private key to the host or container running the Wallarm NGINX Node.
1. Edit the [NGINX configuration](https://nginx.org/en/docs/http/configuring_https_servers.html) of the Wallarm Node:

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

## TLS termination in the Native Node

The Native Node **does not handle TLS termination** and never acts as an inline traffic endpoint. It analyzes a copy of traffic, not the original client connection.

HTTPS traffic must be decrypted by an upstream or adjacent component (e.g., load balancer, reverse proxy, ADC, Ingress Controller, or connector), which then sends a decrypted copy to the Native Node for analysis. Refer to the component's documentation for configuration details.