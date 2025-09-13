[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Helmチャートを使用したWallarm Native Nodeのアップグレード

この手順では、[Helmチャートを使用してデプロイされたNative Node](../../installation/native-node/helm-chart.md)をアップグレードする手順を説明します。

[Helmチャートのリリースを表示](node-artifact-versions.md)

## 要件

HelmチャートでNative NodeをデプロイするKubernetesクラスターは、次の条件を満たす必要があります。

* [Helm v3](https://helm.sh/)パッケージマネージャーがインストールされていること。
* APIが稼働しているAPIゲートウェイまたはCDNからのインバウンドアクセスが可能であること。
* 以下へのアウトバウンドアクセスが可能であること:

    * `https://charts.wallarm.com` Wallarm Helmチャートのダウンロード
    * `https://hub.docker.com/r/wallarm` デプロイに必要なDockerイメージのダウンロード
    * `https://us1.api.wallarm.com`または`https://api.wallarm.com` US/EUのWallarm Cloud用
    * 以下のIPアドレス(攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新のダウンロード、ならびに[許可リスト、拒否リスト、グレーリスト][ip-list-docs]に登録した国・地域・データセンターの正確なIPの取得に使用)

        --8<-- "../include/wallarm-cloud-ips.md"
* 上記に加えて、Wallarm ConsoleでAdministratorロールが割り当てられている必要があります。

## 1. Wallarm Helmチャートリポジトリを更新する

```bash
helm repo update wallarm
```

## 2. WallarmのKubernetesサービスをアップグレードする

デプロイ済みのKubernetesサービスまたはLoad Balancerをアップグレードします:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-node-native --version 0.17.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: 既存のHelmリリースの名前
* `<NAMESPACE>`: Helmリリースが存在するNamespace
* `<PATH_TO_VALUES>`: デプロイ済みソリューションの構成を定義する[`values.yaml`ファイル](../../installation/native-node/helm-chart-conf.md)へのパス

    バージョン0.10.1以上にアップグレードする場合、`config.connector.log_level`パラメータを指定しているときは削除します。より詳細なロギングのため、これは[`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog)セクションに置き換えられています。カスタマイズが必要な場合は`log.*`パラメータを指定します。

## 3. アップグレードを検証する

1. WallarmのPodが起動して稼働していることを確認します:

    ```
    kubectl -n <NAMESPACE> get pods
    ```

    各Podのステータスは、**STATUS: Running**または**READY: N/N**である必要があります。例:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIゲートウェイに送信します:

    ```
    curl https://<GATEWAY_IP>/etc/passwd
    ```
1. アップグレードしたノードが、以前のバージョンと同様に期待どおり動作することを確認します。