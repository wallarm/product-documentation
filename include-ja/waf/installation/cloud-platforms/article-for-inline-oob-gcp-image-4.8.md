# GCPのマシンイメージからWallarmをデプロイします

この記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用したGCP上でのWallarmのデプロイ方法を説明します。ソリューションは[インライン][inline-docs]または[アウトオブバンド][oob-docs]のいずれかの方法でデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Wallarmによるトラフィック解析を有効化します

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXを再起動します

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. トラフィックのWallarmインスタンスへの送信を構成します

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmの動作をテストします

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイ済みのソリューションを微調整します

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"