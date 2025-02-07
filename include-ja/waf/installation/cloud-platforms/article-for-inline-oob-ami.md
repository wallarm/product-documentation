# Amazon Machine ImageからのWallarmのデプロイ

本記事では[公式Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイする方法について説明します。ソリューションは[インライン][inline-docs]または[Out-of-Band][oob-docs]のいずれかの方法でデプロイできます。

最新のWallarm AMIはDebian 12をベースとしており、DebianリポジトリからNGINX 1.22.1を使用します。

## 利用事例

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. Wallarm Cloudへのインスタンス接続

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. Wallarmインスタンスへのトラフィック送信の設定

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

## 8. Wallarmの動作テスト

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイ済みソリューションの微調整

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"