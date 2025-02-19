# GCPマシンイメージを使用したWallarmのデプロイ

この記事では、[公式のマシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上でWallarmをデプロイするための手順をご案内します。ソリューションは[インライン][inline-docs]または[アウトオブバンド][oob-docs]のいずれかでデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. インスタンスをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 6. Wallarmインスタンスへのトラフィック送信の設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 7. Wallarm動作のテスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. デプロイ済ソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"