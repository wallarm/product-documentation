# Specification of the Wallarm cloud-init Script

If following the Infrastructure as Code (IaC) approach, you may need to use the [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) script to deploy the Wallarm node to the public cloud. Starting from release 4.0, Wallarm distributes its cloud images with the ready‑to‑use `cloud-init.py` script that is described in this topic.

## Overview of the Wallarm cloud-init script

The Wallarm `cloud-init` script is available under the `/opt/wallarm/usr/share/wallarm-common/cloud-init.py` path in the [Wallarm AWS cloud image](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe). This script performs both an initial and advanced instance configuration with the following main stages involved:

* Runs the Wallarm node previously created in the Wallarm Cloud by executing the Wallarm `register-node` script 
* Configures the instance in accordance with the proxy approach specified in the `preset` variable (if deploying Wallarm using the [Terraform module](aws/terraform-module/overview.md))
* Fine-tunes the instance in accordance with NGINX snippets
* Fine-tunes the Wallarm node
* Performs health checks for the Load Balancer

The `cloud-init` script is run only once on instance boot, instance restart does not force its launch. You will find more details in the [AWS documentation on the script concept](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html).

## Running the Wallarm cloud-init script

You can run the Wallarm cloud-init script as follows:

* Launch a cloud instance and use its metadata to describe the `cloud-init.py` script run
* Create an instance Launch Template with the `cloud-init.py` script and further create an auto scaling group based on it

The example of the script execution to run the Wallarm node as a proxy server for [httpbin.org](https://httpbin.org):

```bash
#!/bin/bash
set -e

### Prevent NGINX from running without
### Wallarm enabled, it is not recommended to
### run health check before all things get done
###
systemctl stop nginx.service

/opt/wallarm/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarm Node successfuly configured!
```

To meet the Infrastructure as Code (IaC) approach, we have implemented the [Terraform module for AWS](aws/terraform-module/overview.md) that can be an illustrative example of the Wallarm `cloud-init` script usage.

## The Wallarm cloud-init script help data

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Runs the Wallarm node with the specified configuration in the PaaS cluster. https://docs.wallarm.com/installation/cloud-platforms/cloud-init/

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        Wallarm node token copied from the Wallarm Console UI.
  -H HOST, --host HOST  Wallarm API server specific for the Wallarm Cloud being used: https://docs.wallarm.com/about-wallarm/overview/#cloud. By default, api.wallarm.com.
  --skip-register       Skips the stage of local running the node created in the Wallarm Cloud (skips the register-node script
                        execution). This stage is crucial for successful node deployment.
  -p {proxy,custom}, --preset {proxy,custom}
                        Wallarm node preset: "proxy" for the node to operate as a proxy server, "custom" for configuration defined via NGINX snippets only.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Traffic filtration mode: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Proxied server protocol and address. Required if "proxy" is specified as a preset.
  --libdetection        Whether to use the libdetection library during the traffic analysis: https://docs.wallarm.com/about-wallarm/protecting-against-attacks/#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        Custom configuration to be added to the NGINX global configuration.
  --http-snippet HTTP_SNIPPET_FILE
                        Custom configuration to be added to the "http" configuration block of NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        Custom configuration to be added to the "server" configuration block of NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        Level of verbosity.

This script covers a few most popular configurations for AWS, GCP, Azure and other PaaS. If you need a more powerful configuration,
you are welcome to review Wallarm node public documentation: https://docs.wallarm.com.
```
