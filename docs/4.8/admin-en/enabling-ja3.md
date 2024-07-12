# Enabling JA3 Fingerprinting

This article describes how to enable JA3 fingerprinting for the most popular software such as NGINX and infrastructure such as AWS, Google Cloud, and Azure.

## Overview

Attackers frequently employ various techniques to bypass security measures, such as user agent (UA) spoofing and IP rotation. These methods make it challenging to detect behavioral attacks in the unauthenticated traffic. [JA3 fingerprinting](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/) generates an MD5 hash for specific parameters defined during the TLS negotiation between client and server. This fingerprinting method can enhance the identification of threat actors as part of API session processing and contribute to building a behavioral profile for [API abuse prevention](../api-abuse-prevention/overview.md).

## NGINX

An ability to get a JA3 fingerprint from NGINX makes this identification method available in all NGINX-based Wallarm [deployment options](../installation/supported-deployment-options.md). There are two NGINX modules for JA3:

| Module | Description | Installation |
| - | - | - |
| [nginx-ssl-ja3](https://github.com/fooinha/nginx-ssl-ja3) | Main nginx module for JA3. Has the `THIS IS NOT PRODUCTION` mark. So there is no guarantee of success. | [Instructions](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [nginx-ssl-fingerprint](https://github.com/phuslu/nginx-ssl-fingerprint) | Second nginx module for JA3. It has the `high performance` label and also has likes and forks. | [Instructions](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

In both modules, we need to patch OpenSSL and NGINX.

An example of module installation (from the `nginx-ssl-fingerprint` module):

```
# Clone

$ git clone -b OpenSSL_1_1_1-stable --depth=1 https://github.com/openssl/openssl
$ git clone -b release-1.23.1 --depth=1 https://github.com/nginx/nginx
$ git clone https://github.com/phuslu/nginx-ssl-fingerprint

# Patch

$ patch -p1 -d openssl < nginx-ssl-fingerprint/patches/openssl.1_1_1.patch
$ patch -p1 -d nginx < nginx-ssl-fingerprint/patches/nginx.patch

# Configure & Build

$ cd nginx
$ ASAN_OPTIONS=symbolize=1 ./auto/configure --with-openssl=$(pwd)/../openssl --add-module=$(pwd)/../nginx-ssl-fingerprint --with-http_ssl_module --with-stream_ssl_module --with-debug --with-stream --with-cc-opt="-fsanitize=address -O -fno-omit-frame-pointer" --with-ld-opt="-L/usr/local/lib -Wl,-E -lasan"
$ make

# Test

$ objs/nginx -p . -c $(pwd)/../nginx-ssl-fingerprint/nginx.conf
$ curl -k https://127.0.0.1:8444
```

Example NGINX configuration:

```
server {
  listen 80;
  server_name example.com;
  …
  # Proxy pass the JA3 fingerprint header to another app.
  proxy_set_header X-Client-TLS-FP-Value $http_ssl_ja3_hash;
  proxy_set_header X-Client-TLS-FP–Raw-Value $http_ssl_ja3;

  # Proxy the request to the proxied app.
  proxy_pass http://app:8080;
}
```

## AWS

You can configure getting [JA3 fingerprints from AWS CloudFront](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudfront-supports-ja3-fingerprint-headers/).

Wallarm can integrate with CloudFront to get the `CloudFront-Viewer-JA3-Fingerprint` and `CloudFront-Viewer-TLS` JA3 headers:

1. Go to the CloudFront console and select the **Origin Request Policies** tab.
1. Click **Create Origin Request Policy** and set the policy details.

    ![CloudFront - creating origin request policy](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. In the **Actions** section, select **Add Header**.
1. In the **Header Name** field, enter `CloudFront-Viewer-JA3-Fingerprint`.

    ![CloudFront - adding header to origin request policy](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. Click **Create**. Your origin request policy is now created.
1. To attach the created request policy to your CloudFront distribution, follow the steps below.
1. In CloudFront console, select the distribution to which you want to attach the policy.
1. Click the **Edit** button next to **Origin Request Policies**.
1. Select the checkbox next to the policy you created and save the changes.

    ![CloudFront - attach policy to distribution](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

    Your origin request policy is now attached to your CloudFront distribution. Clients that make requests to your distribution will now have the `CloudFront-Viewer-JA3-Fingerprint` header added to their requests.

## Google Cloud

You can configure getting JA3 fingerprints from the classic Google Cloud Application Load Balancer by configuring custom header and getting its value via the `tls_ja3_fingerprint` variable:

1. Go to the Google Cloud console → **Load balancing**.
1. Click **Backends**.
1. Click the name of a backend service and then **Edit**.
1. Click **Advanced configurations**.
1. Under **Custom request headers**, click **Add header**.
1. Enter the **Header name** and set the **Header value** to `tls_ja3_fingerprint`.
1. Save changes.

See detailed instructions [here](https://cloud.google.com/load-balancing/docs/https/custom-headers).

Example configuration request:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

For [Azure Wallarm deployment](../installation/cloud-platforms/azure/docker-container.md), use getting a JA3 fingerprint from NGINX method described [above](#nginx).
