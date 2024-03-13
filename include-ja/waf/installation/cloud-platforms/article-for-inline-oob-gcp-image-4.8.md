# GCP Machine Imageを使用したWallarmのデプロイ

この記事では、[公式Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmをデプロイするための手順を提供します。このソリューションは、[インライン][inline-docs]または[アウトオブバンド][oob-docs]でデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Wallarmにトラフィック分析を有効にする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイされたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"