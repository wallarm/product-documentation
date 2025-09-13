# Amazon Machine ImageからのWallarmのデプロイ

本記事では、[公式のAmazon Machine Image（AMI）](https://aws.amazon.com/marketplace/pp/B073VRFXSD)を使用し、AWSでWallarmを[インライン][inline-docs]でデプロイする手順を説明します。

このイメージはDebianおよびDebianが提供するNGINXのバージョンをベースにしています。現在、最新のイメージはDebian 12を使用しており、NGINX stable 1.22.1を含みます。

AWS上のAMIからWallarmノードをデプロイする作業は通常約10分で完了します。

![!][aws-ami-traffic-flow]

!!! info "セキュリティに関する注意"
    このソリューションはAWSのセキュリティベストプラクティスに従うよう設計されています。デプロイにはAWSのルートアカウントの使用は避けることをおすすめします。代わりに、必要最小限の権限のみを付与したIAMユーザーまたはロールを使用してください。

    デプロイプロセスは最小権限の原則を前提としており、Wallarmコンポーネントのプロビジョニングと運用に必要な最小限のアクセス権のみを付与します。

このデプロイに伴うAWSインフラストラクチャコストの見積もり方法については、[AWSでWallarmをデプロイする際のコストガイダンス][aws-costs]ページをご覧ください。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. インスタンスをWallarm Cloudに接続する

クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを介してWallarm Cloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルに監視[モード][wallarm-mode]に設定し、`--proxy-pass`フラグに基づいて正当なトラフィックを転送するようノードを構成します。NGINXを再起動すると設定が完了します。

クラウドイメージから作成したインスタンス上で次のように`cloud-init.py`スクリプトを実行します。

=== "USクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EUクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` はノードグループ名を設定します（既存のグループ、または存在しない場合は作成されます）。APIトークンを使用する場合にのみ適用されます。
* `<TOKEN>` はコピーしたトークンの値です。
* `<PROXY_ADDRESS>` はWallarmノードが正当なトラフィックをプロキシ転送する宛先アドレスです。アーキテクチャに応じて、アプリケーションインスタンスのIP、ロードバランサー、DNS名などを指定できます。

## 7. Wallarmインスタンスにトラフィックを送信するよう構成する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 8. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 9. デプロイ済みソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"