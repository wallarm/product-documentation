```markdown
[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm eBPFベースソリューション（ベータ版）

Wallarmは、Linuxカーネルのパワーを活用し、Kubernetes環境とシームレスに統合するeBPFベースのセキュリティソリューションのベータ版を提供します。本記事では、Helmチャートを使用してソリューションを利用・展開する方法について説明します。

## トラフィックフロー

Wallarm eBPFベースソリューションによるトラフィックフロー:

![eBPF traffic flow](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

eBPFソリューションは、以下のプロトコルを使用してトラフィックを監視するよう設計されています:

* HTTP 1.xまたはHTTP 2
* Proxy v1またはProxy v2

トラフィックはTLS/SSLによる暗号化またはプレーンテキストでのデータ転送を利用する場合があります。SSLトラフィックの解析は、共有OpenSSLライブラリ（例: NGINX、HAProxy）を使用しているサーバーに限定され、Envoyなど他のSSL実装を採用しているサーバーではご利用いただけません。

## 動作概要

Linuxオペレーティングシステムは、ハードウェアリソースおよび重要なタスクを管理するカーネルと、アプリケーションが実行されるユーザースペースから構成されます。この環境内で、eBPF（Extended Berkeley Packet Filter）はLinuxカーネル内でカスタムプログラムの実行を可能にし、セキュリティに特化したプログラムも含まれます。[eBPFの詳細](https://ebpf.io/what-is-ebpf/)をご覧ください。

Kubernetesは、プロセスの分離、リソース管理、ネットワーキングなどの重要なタスクにLinuxカーネルの機能を活用しているため、eBPFベースのセキュリティソリューションの統合に適した環境を提供します。これに沿い、WallarmはKubernetesとシームレスに統合し、カーネルの機能を活用するeBPFベースのセキュリティソリューションを提供します。

本ソリューションは、トラフィックミラーリングを生成してWallarmノードに転送するエージェントで構成されます。展開時には、名前空間またはPod単位でミラーレベルを指定できます。Wallarmノードは、ミラーされたトラフィックをセキュリティの脅威として検査し、悪意ある活動をブロックすることなく検出された活動をWallarm Cloudに記録し、Wallarm Console UIを通じてトラフィックセキュリティの可視性を提供します。

以下の図は、ソリューションコンポーネントを示しています:

![eBPF components](../../../images/waf-installation/epbf/ebpf-components.png)

eBPFエージェントは、全てのKubernetesワーカーノードにDaemonSetとして展開されます。適切な機能を確保するため、エージェントコンテナは特権モードで以下の必須ケーパビリティー: `SYS_PTRACE`および`SYS_ADMIN`を付与して実行する必要があります。

さらに、本ソリューションはレスポンスコードを処理し、Wallarmの主要な[API Discovery](../../../api-discovery/overview.md)モジュールがAPIエンドポイントを識別し、APIインベントリを構築して最新の状態に保つことを可能にします。

## ユースケース

サポートされている[Wallarm展開オプション](../../supported-deployment-options.md)の中でも、本ソリューションはアウトオブバンド運用に推奨します。インラインで動作するのではなく、トラフィックのミラーコピーを取得することで、eBPFベースソリューションはトラフィックフローの中断なく動作します。このアプローチにより、ライブトラフィックへの影響を最小限に抑え、レイテンシに影響を与える余分な遅延を避けることができます。

## 技術要件

eBPFソリューションを正常に展開するために、以下の技術的前提条件が満たされていることを確認してください:

* サポートされているKubernetesバージョン:
  
    * AWS - Kubernetes 1.24以上
    * Azure - Kubernetes 1.26以上
    * GCP - 任意のKubernetesバージョン
    * ベアメタルサーバー - Kubernetes 1.22以上
* エージェントがWallarm処理ノードに安全にキャプチャされたトラフィックをミラーリングできるよう、[cert-manager](https://cert-manager.io/docs/installation/helm/)をインストール済みであること
* [Helm v3](https://helm.sh/)パッケージマネージャー
* BTF（BPF Type Format）が有効なLinuxカーネルバージョン5.10または5.15。Ubuntu、Debian、RedHat、Google COS、またはAmazon Linux 2でサポート
* x86_64アーキテクチャのプロセッサ
* 本ソリューションはベータ版であるため、全てのKubernetesリソースを効果的にミラーリングできるわけではありません。したがって、KubernetesにおけるNGINX Ingressコントローラー、Kong Ingressコントローラー、または通常のNGINXサーバーに対してトラフィックミラーリングを有効にすることを推奨します
* ユーザーアカウントは、Wallarm Console上で[**Administrator**アクセス](../../../user-guides/settings/users.md#user-roles)を有している必要があります

もし利用ケースが上記の要件と異なる場合は、具体的な技術情報を添えて当社の[sales engineers](mailto:sales@wallarm.com)までお問い合わせいただき、特定のニーズに合わせた調整の可能性を検討してください。

## ネットワークアクセス

アウトバウンドトラフィックが制限された環境で本ソリューションが正しく動作するよう、以下の外部リソースへのネットワークアクセスを許可するよう設定してください:

* Wallarm Helmチャートを追加するための `https://charts.wallarm.com`
* Docker HubからWallarm Dockerイメージを取得するための `https://hub.docker.com/r/wallarm`
* 米国Wallarm Cloudをご利用のユーザーは `https://us1.api.wallarm.com` に、EU Wallarm Cloudをご利用のユーザーは `https://api.wallarm.com` にアクセス
* 攻撃検知ルールのアップデートおよび[API仕様](../../../api-specification-enforcement/overview.md)のダウンロード、さらに[許可リスト、拒否リスト、またはグレイリスト](../../../user-guides/ip-lists/overview.md)に該当する国、地域、データセンターの正確なIP取得のため、以下のIPアドレス

    --8<-- "../include/wallarm-cloud-ips.md"

## 展開

Wallarm eBPFソリューションを展開する手順は以下の通りです:

1. Wallarmノードを作成する
1. Wallarm Helmチャートを展開する
1. トラフィックミラーリングを有効にする
1. Wallarm eBPFの動作をテストする

### Step 1: Wallarmノードを作成する

1. Wallarm Console → **Nodes** にアクセスしてください。以下のリンクからアクセスできます:

    * 米国Cloudの場合: https://us1.my.wallarm.com/nodes
    * EU Cloudの場合: https://my.wallarm.com/nodes
1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーしてください。
    
    ![!Creation of a Wallarm node](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Step 2: Wallarm Helmチャートを展開する

1. 上記の要件を満たしており、[cert-manager](https://cert-manager.io/docs/installation/helm/)がインストール済みであることを確認してください。
1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm eBPFソリューション設定](helm-chart-for-wallarm.md)を記載した`values.yaml`ファイルを作成してください。

    最小構成の例:
    
    === "US Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>`は、Kubernetes上で実行するWallarmノードのトークンです。

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helmチャートを展開します:

    ``` bash
    helm install --version 0.10.28 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarm eBPFチャートのHelmリリース名です
    * `wallarm-ebpf`はWallarm eBPFチャートのHelmリリースを展開するための新しい名前空間です。別の名前空間に展開することを推奨します
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### Step 3: トラフィックミラーリングを有効にする

NGINX Ingressコントローラー、Kong Ingressコントローラー、または通常のNGINXサーバーに対してWallarm eBPFベースソリューションを効果的に活用するため、トラフィックミラーリングの有効化を推奨します。

デフォルトでは、展開されたソリューションはトラフィックを解析しません。トラフィック解析を有効とするには、希望するレベルでトラフィックミラーリングを有効にする必要があります。対象は以下の通りです:

* 名前空間単位
* Pod単位
* ノード名またはコンテナ単位

トラフィックミラーリングの有効化には、動的フィルターとして名前空間のラベルまたはPodのアノテーションを使用する方法と、`values.yaml`内の`config.agent.mirror.filters`ブロックを使用して制御する方法の2通りがあります。これらの方法を組み合わせることも可能です。[詳細](selecting-packets.md)

#### ラベルを使用して名前空間単位でのミラーリング

名前空間でミラーリングを有効にするには、名前空間ラベル`wallarm-mirror`を`enabled`に設定してください:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### アノテーションを使用してPod単位でのミラーリング

Podでミラーリングを有効にするには、`mirror.wallarm.com/enabled`アノテーションを`true`に設定してください:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### `values.yaml`を使用して、名前空間、Pod、コンテナ、またはノード単位でのミラーリングを有効にする

より詳細な制御が必要な場合は、Wallarm eBPFの`values.yaml`ファイル内の`config.agent.mirror.filters`ブロックを使用してミラーリングレベルを指定できます。フィルターの設定方法およびWallarmの名前空間ラベルとPodアノテーションとの連携方法については、[記事](selecting-packets.md)を参照してください。

### Step 4: Wallarm eBPFの動作をテストする

Wallarm eBPFが正常に動作しているかをテストするには、以下の手順を実行してください:

1. Wallarm Podの詳細を取得し、正常に起動していることを確認します:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    各Podは、**READY: N/N**と**STATUS: Running**が表示されるはずです。例:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. 実際のロードバランサーのIPアドレスまたはDNS名に置き換えて、アプリケーションに[Path Traversal](../../../attacks-vulns-list.md#path-traversal)攻撃のテストを送信してください:

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    Wallarm eBPFソリューションはアウトオブバンド方式で動作するため、攻撃をブロックせず、検出のみを登録します。

    攻撃が登録されたか確認するには、Wallarm Console → **Events**に進んでください:

    ![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## 制限事項

* アウトオブバンド（OOB）方式で動作し、実際のトラフィックフローから独立して解析するため、いくつかの固有の制限があります:

    * 悪意あるリクエストを即座にブロックすることはできません。Wallarmは攻撃を観測し、[Wallarm Console上での詳細](../../../user-guides/events/check-attack.md)のみを提供します。
    * ターゲットサーバーへの負荷を制限することが不可能なため、[レートリミッティング](../../../user-guides/rules/rate-limiting.md)はサポートされません。
    * IPアドレスによる[フィルタリング](../../../user-guides/ip-lists/overview.md)はサポートされません。
* サーバーのレスポンスボディがミラーリングされないため:

    * [パッシブ検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)に基づく脆弱性検出はサポートされません。
    * API DiscoveryでのAPIエンドポイントの[レスポンス構造の表示](../../../api-discovery/exploring.md#endpoint-details)はサポートされません。

* 本ソリューションはベータ版であるため、すべてのKubernetesリソースを効果的にミラーリングできるわけではありません。したがって、KubernetesにおけるNGINX Ingressコントローラー、Kong Ingressコントローラー、または通常のNGINXサーバーに対してトラフィックミラーリングを有効にすることを推奨します。
```