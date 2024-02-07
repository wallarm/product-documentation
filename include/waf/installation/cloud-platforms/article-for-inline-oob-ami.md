# Deploying Wallarm from Amazon Machine Image

This article provides instructions for deploying Wallarm on AWS using the [official Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). The solution can be deployed either [in-line][inline-docs] or [Out-of-Band][oob-docs].

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Connect the instance to the Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 8. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"