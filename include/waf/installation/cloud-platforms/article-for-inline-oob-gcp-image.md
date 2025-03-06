# Deploying Wallarm from GCP Machine Image

This article provides instructions for deploying Wallarm on GCP using the [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). The solution can be deployed either [in-line][inline-docs] or [Out-of-Band][oob-docs].

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Connect the instance to the Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-5.0.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"