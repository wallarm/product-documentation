# GCPのマシンイメージからWallarmをデプロイする

本記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCPにWallarmをデプロイする手順を説明します。ソリューションは[インライン][inline-docs]または[アウトオブバンド][oob-docs]でデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-5.x.md"

## 5. インスタンスをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. Wallarmインスタンスにトラフィックを送信するように構成する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. デプロイ済みのソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-5.0.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"