# Amazon Machine ImageからのWallarmのデプロイ

本記事では、[公式Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用してAWS上にWallarmをデプロイする手順を説明します。ソリューションは[インライン][inline-docs]または[アウトオブバンド][oob-docs]のいずれかでデプロイできます。

最新のWallarm AMIはDebian 12をベースとしており、DebianリポジトリのNGINX 1.22.1を使用します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. インスタンスをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-for-cloud-images.md"

## 7. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob-latest.md"

        構成でミラーリングサーバーをパブリックサブネット経由でWallarmフィルタリングノードに接続する場合は、`set_real_ip_from`および`real_ip_header`ディレクティブで適切なサブネット設定も指定する必要があります。サブネットが内部の場合は不要です。

## 8. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイ済みソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-5.0.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"