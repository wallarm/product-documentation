# Amazon Machine ImageからWallarmをデプロイする

この記事では、[公式のAmazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイするための指示を提供します。このソリューションは、[インライン][inline-docs]または[アウト・オブ・バンド][oob-docs]でデプロイできます。

## 使用例

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. トラフィックを分析するためにWallarmを有効にする

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動する

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. デプロイされたソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"