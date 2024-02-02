# Deploying Wallarm from Amazon Machine Image

This article provides instructions for deploying Wallarm on AWS using the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). The solution can be deployed either [in-line][inline-docs] or [Out-of-Band][oob-docs].

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. Restart NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"
