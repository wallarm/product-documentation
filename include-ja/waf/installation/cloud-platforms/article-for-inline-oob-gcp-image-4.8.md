# GCPマシンイメージからWallarmをデプロイする

この記事では、[公式Machine Image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmをデプロイする手順について説明します。ソリューションは[in-line][inline-docs]または[Out-of-Band][oob-docs]のいずれかでデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image-4.8.md"

## 5. Wallarmがトラフィックを解析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXの再起動

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 7. Wallarmインスタンスへのトラフィック送信の設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmの動作テスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイしたソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"