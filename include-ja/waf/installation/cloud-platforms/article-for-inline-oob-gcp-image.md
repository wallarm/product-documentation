# GCPマシンイメージからWallarmをデプロイする

この記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmをデプロイするための手順を提供します。解決策は、[インライン][inline-docs]または[帯域外][oob-docs]でデプロイできます。

<!-- ???
すべての地域がサポートされていると言う -->

--8<-- "../include-ja/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Wallarmがトラフィックを分析できるようにする

--8<-- "../include-ja/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXを再起動する

--8<-- "../include-ja/waf/installation/cloud-platforms/restart-nginx.md"

## 7. トラフィックをWallarmインスタンスに送信する設定を行う

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmの操作をテストする

--8<-- "../include-ja/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイしたソリューションの微調整

--8<-- "../include-ja/waf/installation/cloud-platforms/fine-tuning-options.md"