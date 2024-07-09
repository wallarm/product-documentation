# Enabling JA3 Fingerprinting

This article describes how to enable JA3 fingerprinting for the most popular software such as NGINX and infrastructure such as AWS, Google Cloud, and Azure.

## Overview

The companies may have about 90% of the unauthenticated traffic which can make the [API Sessions](../api-sessions.md) and [API Abuse Prevention](../api-abuse-prevention/overview.md) (based on sessions) functionalities less useful if the sources of such traffic are not properly identified. By default this is solved by using the "IP address + user agent" client identification mechanism. However this mechanism by itself may be not very precise.

This is good to have a different option for entity identification and [JA3 fingerprinting](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/) is a standard way to do that. JA3 fingerprinting is a method for creating fingerprints of SSL/TLS clients. Unlike traditional TLS fingerprinting that focuses on various aspects of the TLS handshake, JA3 zeroes in on the specifics of the TLS client's ClientHello packet. This packet, sent by clients initiating a TLS handshake, contains several details about the client's TLS preferences. JA3 gathers these details and compiles them into an MD5 hash. This hash represents the fingerprint of the client, providing a consistent and identifiable signature.

## Requirements and limitations

You should consider the following:

* This functionality requires node version 4.10.2 or later.
* Revision 110 of the Chrome browser introduces TLS ClientHello extension random permutation, which makes fingerprinting irrelevant with this browser (Firefox is planning to do the same). For non-browser clients, fingerprinting will continue working.

## NGINX

An ability to get a JA3 fingerprint from NGINX makes this identification method available in all NGINX-based Wallarm [deployment options](../installation/supported-deployment-options.md). There are two NGINX modules for JA3:

| Module | Description | Installation |
| - | - | - |
| [Module #1](https://github.com/fooinha/nginx-ssl-ja3) | Main nginx module for JA3. Has the `THIS IS NOT PRODUCTION` mark. So there is no guarantee of success. | [Instruction](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [Module #2](https://github.com/phuslu/nginx-ssl-fingerprint) | Second nginx module for JA3. It has the `high performance` label and also has likes and forks. | [Instruction](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

In both modules, we need to patch OpenSSL and NGINX.

An example of module installation (from module #2):

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

!!! warning "Other AWS products"
    [AWS ALB](https://aws.amazon.com/elasticloadbalancing/) cannot calculate JA3 fingerprints.

Wallarm can integrate with CloudFront to get the `CloudFront-Viewer-JA3-Fingerprint` and `CloudFront-Viewer-TLS` JA3 headers:

1. Go to the CloudFront console and select the **Origin Request Policies** tab.
1. Click **Create Origin Request Policy** and set the policy details.

    ![CloudFront - creating origin request policy](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. In the **Actions** section, select **Add Header**.
1. In the **Header Name** field, enter `Cloudfront-viewer-ja3-fingerprint`.

    ![CloudFront - adding header to origin request policy](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. Click **Create**. Your origin request policy is now created.
1. To attach the created request policy to your CloudFront distribution, follow the steps below.
1. In CloudFront console, select the distribution to which you want to attach the policy.
1. Click the **Edit** button next to **Origin Request Policies**.
1. Select the checkbox next to the policy you created and save the changes.

    ![CloudFront - attach policy to distribution](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

    Your origin request policy is now attached to your CloudFront distribution. Clients that make requests to your distribution will now have the `Cloudfront-viewer-ja3-fingerprint` header added to their requests.

## Google Cloud

You can configure getting JA3 fingerprints from the classic Google Cloud Application Load Balancer by configuring custom header and getting its value via the `tls_ja3_fingerprint` variable.

To do so, follow the instructions [here](https://cloud.google.com/load-balancing/docs/https/custom-headers).

Example configuration request:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

For [Azure Wallarm deployment](../installation/cloud-platforms/azure/docker-container.md), use getting a JA3 fingerprint from NGINX method described [above](#nginx).
