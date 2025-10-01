# Amazon Machine ImageからWallarmをデプロイします

本記事では、[公式のAmazon Machine Image(AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイする手順を説明します。ソリューションは[インライン][inline-docs]または[アウトオブバンド][oob-docs]のいずれかでデプロイできます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami.md"

## 6. Wallarmによるトラフィック解析を有効化します

--8<-- "../include/waf/installation/cloud-platforms/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動します

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"

## 8. Wallarmインスタンスへのトラフィック送信を構成します

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmの動作をテストします

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 10. デプロイ済みソリューションを微調整します

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-4.8.md"