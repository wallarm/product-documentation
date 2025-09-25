# GCPマシンイメージからのWallarmのデプロイ

本記事では、[公式のマシンイメージ](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node)を使用して、GCP上に[インライン][inline-docs]でWallarmをデプロイする手順を説明します。

このイメージはDebianおよびDebianが提供するNGINXのバージョンに基づいています。現在、最新のイメージはDebian 12を使用しており、NGINX安定版1.22.1を含みます。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. フィルタリングノードをWallarm Cloudに接続する

クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプト経由でWallarm Cloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルに監視[モード][wallarm-mode]へ設定し、`--proxy-pass`フラグに基づいて正規のトラフィックを転送するようノードをセットアップします。NGINXを再起動するとセットアップが完了します。

クラウドイメージから作成したインスタンス上で、次のように`cloud-init.py`スクリプトを実行します。

=== "USクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EUクラウド"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'`はノードグループ名を設定します（既存の場合、存在しない場合は作成されます）。これはAPIトークンを使用している場合にのみ適用されます。
* `<TOKEN>`はコピーしたトークンの値です。
* `<PROXY_ADDRESS>`は、Wallarmノードが正規のトラフィックをプロキシ転送する宛先アドレスです。アーキテクチャに応じて、アプリケーションインスタンスやロードバランサのIP、DNS名などを指定できます。

## 6. Wallarmインスタンスへのトラフィック送信を構成する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. Wallarmの動作をテストする

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. デプロイ済みソリューションを微調整する

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"