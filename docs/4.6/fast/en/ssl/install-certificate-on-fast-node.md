[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/


#   Installing Your Own SSL Certificate to the FAST Node

> ####  Info:: Prerequisites
> This guide assumes that
> * Your browser is configured to use a FAST node as an HTTP or HTTPS proxy.
> * Your browser already trusts the SSL certificate you are going to install for the FAST node.

<!-- -->

> ####  Warning:: Certificate requirements
> To successfully complete this installation, your SSL certificate must be either a root certificate or an intermediate certificate.
> 
> The certificate and the corresponding private key must be [encoded using PEM][link-pem-encoding]. If your certificate has a different encoding, you can use any available certificate conversion tool, such as [OpenSSL][link-openssl] to convert it to a PEM encoded certificate.


##  Installing SSL Certificate

To install an SSL certificate to th FAST node, follow these steps:
1.  Make sure that you already have an SSL certificate, as well as the private key that signed the certificate, in the PEM format.

2.  Place the certificate file and the key file in the same directory on the Docker host. It will be necessary to mount this directory to the Docker container with the FAST node in the next steps.

3.  Specify the FAST node where the certificate and key are located using the following environment variables:

    ```
    CA_CERT=<internal path to the certificate>
    CA_KEY=<internal path to the key>
    ```
    
    In the lines above, replace the values `<internal path to the certificate>` and `<internal path to the key>` with the expected path to the certificate and key after mounting the directory in the Docker container.

4.  Deploy the Docker container with the FAST node by running the following command:

    ```
    docker run --name <name> \ 
    -e WALLARM_API_TOKEN=<token> \
    -e ALLOWED_HOSTS=<host list> \
    -e CA_CERT=<internal path to the certificate> \
    -e CA_KEY=<internal path to the key> \
    -v <path to the directory with the certificate and key>:<internal path to the directory> \
    -p <publishing port>:8080 \
    wallarm/fast
    ```
    
    This command defines the following parameters:
    *   The container's name.
    *   The token and host list of the target application using the `WALLARM_API_TOKEN` and `ALLOWED_HOSTS` environment variables (the last one is not mandatory).
    *   The location of the SSL certificate file inside the container by using the `CA_CERT` variable.
    *   The location of the private key file inside the container by using the `CA_KEY` variable.
    *   The application publishing port.
    <br><br>
    
    Use the `-v` option of the `docker run` command to mount the Docker host's directory `<path to the directory with the certificate and key>` in the container. The contents of this directory become available inside the container on the path `<internal path to the directory>`. 
    <br>

    >   #### Warning:: Note
    >   
    >   The paths to the certificate and key files specified with the `CA_CERT` and `CA_KEY` environment variables must point to the files in the `<internal path to the directory>` parameter that you specified with the `-v` option of the `docker run` command.   

Now your SSL certificate should be successfully installed. Your FAST node instance will now proxy HTTPS requests without any untrusted certificate messages.


##  An Example of Installing an SSL Certificate.

The following is supposed to be the case:
*   The `cert.pem` and `cert.key` files with the SSL certificate and corresponding private key are located in the `/home/user/certs` directory of the Docker host where the FAST node is launched,
*   The contents of the `/home/user/certs` directory will be available inside the container with the FAST node on the `/tmp/certs` path,
*   The `fast_token` token is used,
*   Only `example.com` is included in the host list, and
*   The FAST node will run in the container named `fast-node` and its internal port `8080` will be published in `localhost:8080`,

then you need to execute the following command to connect the SSL certificate to the FAST node:

```
docker run --name fast-node \
-e WALLARM_API_TOKEN="fast_token" \
-e ALLOWED_HOSTS="example.com" \
-e CA_CERT="/tmp/certs/cert.pem" \
-e CA_KEY="/tmp/certs/cert.key" \
-v /home/user/certs:/tmp/certs \
-p 8080:8080 \
wallarm/fast
```   
