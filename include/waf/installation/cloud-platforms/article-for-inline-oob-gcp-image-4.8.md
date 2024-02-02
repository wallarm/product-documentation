# Deploying Wallarm from GCP Machine Image

This article provides instructions for deploying Wallarm on GCP using the [official Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). The solution can be deployed either [in-line][inline-docs] or [Out-of-Band][oob-docs].

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. Restart NGINX

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Test the Wallarm operation

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. Fine-tune the deployed solution

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"
