[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Helm Chartを使用したWallarm Native Nodeのアップグレード

以下の手順は[Helm Chartを使用してデプロイされたNative Node](../../installation/native-node/helm-chart.md)のアップグレード方法について説明します。

[Helm Chartのリリースを表示](node-artifact-versions.md)

## 要件

Helm Chartを用いてNative NodeをデプロイするKubernetesクラスターは、以下の要件を満たす必要があります:

* [Helm v3](https://helm.sh/)パッケージマネージャーがインストールされていること
* APIが稼働中のAPIゲートウェイまたはCDNからのインバウンドアクセスが可能であること
* 以下へのアウトバウンドアクセスが可能であること:

    * `https://charts.wallarm.com`にアクセスしてWallarm Helm Chartをダウンロードできること
    * `https://hub.docker.com/r/wallarm`にアクセスして、デプロイに必要なDockerイメージをダウンロードできること
    * US/EU Wallarm Cloudの場合、`https://us1.api.wallarm.com`または`https://api.wallarm.com`にアクセスできること
    * 攻撃検出ルールの更新および[API仕様][api-spec-enforcement-docs]のダウンロード、ならびに[許可リスト、拒否リスト、またはグレイリスト][ip-list-docs]国、リージョン、またはデータセンターの正確なIPの取得のために、以下のIPアドレスへアクセスできること

        --8<-- "../include/wallarm-cloud-ips.md"
* 上記に加えてWallarm Consoleで**Administrator**ロールが割り当てられている必要があります

## 1. Wallarm Helm Chartリポジトリの更新

```bash
helm repo update wallarm
```

## 2. Wallarm Kubernetesサービスのアップグレード

デプロイ済みのKubernetesサービスまたはロードバランサーをアップグレードします:

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-node-native --version 0.11.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: 既存のHelmリリースの名前
* `<NAMESPACE>`: Helmリリースが存在するネームスペース
* `<PATH_TO_VALUES>`: デプロイされたソリューションの構成を定義する[`values.yaml`ファイル](../../installation/native-node/helm-chart-conf.md)へのパス

バージョン0.10.1以降にアップグレードする際、指定されている場合は`config.connector.log_level`パラメータを削除してください。より細かいログ設定が可能な[`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog)セクションに置き換えられました。カスタマイズが必要な場合は`log.*`パラメータを指定してください。

## 3. アップグレードの検証

1. Wallarmのポッドが稼働していることを確認します:

    ```
    kubectl -n <NAMESPACE> get pods
    ```

    各ポッドのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例えば:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストをAPIゲートウェイへ送信します:

    ```
    curl https://<GATEWAY_IP>/etc/passwd
    ```
1. アップグレード後のノードが以前のバージョンと比較して期待通りに動作していることを確認します。