# GCPマシンイメージからWallarmの展開

この記事では、[公式マシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用してGCP上にWallarmを展開する方法を提供します。このソリューションは、インラインまたは[アウトオブバンド][oob-docs]で展開することができます。

<!-- ???
すべての地域が対応していると言います -->

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.ja.md"

## 5. Wallarmがトラフィックを分析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.ja.md"

## 6. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.ja.md"

## 7. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.ja.md"

## 8. Wallarmの操作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.ja.md"

## 9. 展開したソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.ja.md"