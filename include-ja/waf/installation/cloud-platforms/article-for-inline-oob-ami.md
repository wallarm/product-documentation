# Amazon Machine ImageからWallarmをデプロイする

この記事は、[公式のAmazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイするための指示を提供します。このソリューションは、[インライン][inline-docs]または[Out-of-Band][oob-docs]のどちらで展開することもできます。

<!-- ???
すべての領域がサポートされていると述べてください -->

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmがトラフィックを解析できるようにする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Wallarmインスタンスにトラフィックを送信するように設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmの操作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. デプロイしたソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"