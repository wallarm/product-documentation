# GCPマシンイメージを使用したWallarmのデプロイ

この記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmをデプロイする方法について説明します。このソリューションは、[インライン][inline-docs]または[アウトオブバンド][oob-docs]のいずれかでデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.6.md"

## 5. Wallarmがトラフィックを分析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXの再起動

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Wallarmインスタンスにトラフィックを送信するように設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmの動作をテスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイしたソリューションの調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"