# Docker NGINXベースのイメージのアップグレード

これらの手順は、稼働中のDocker NGINXベースのイメージ4.xをバージョン5.0にアップグレードする手順を説明します。

!!! warning "既存のWallarmノードの資格情報の使用"
    以前のバージョンの既存のWallarmノードの使用は推奨しません。これらの手順に従い、バージョン5.0の新しいフィルタリングノードを作成し、Dockerコンテナとしてデプロイしてください。

サポート終了ノード（バージョン3.6以下）のアップグレードには[こちらの手順](older-versions/docker-container.md)をご利用ください。

## 要件

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## ステップ1: 更新されたフィルタリングノードのイメージをダウンロードする

``` bash
docker pull wallarm/node:5.3.0
```

## ステップ2: 稼働中のコンテナを停止する

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## ステップ3: 新しいイメージを使用してコンテナを起動する

1. Wallarm Console → **Settings** → **API Tokens** に進み、**Deploy**ロールを持つトークンを生成してください。
1. 生成されたトークンをコピーしてください。
1. コピーしたトークンを使用して更新されたイメージを起動してください。
    
    更新されたイメージを使用してコンテナを起動するには、以下の2つの方法があります:
    
    * [環境変数を使用して](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [マウントされた設定ファイルで](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## ステップ4: フィルタリングノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ステップ5: 以前のバージョンのフィルタリングノードを削除する

もしバージョン5.0のデプロイされたイメージが正常に動作する場合は、Wallarm Console → **Nodes**にて以前のバージョンのフィルタリングノードを削除することができます。