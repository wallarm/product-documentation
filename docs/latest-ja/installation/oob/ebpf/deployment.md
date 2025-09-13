[deployment-platform-docs]:    ../../supported-deployment-options.md

# WallarmのeBPFベースソリューション（ベータ版）

Wallarmは、Linuxカーネルの機能を活用し、Kubernetes環境とシームレスに統合するeBPFベースのセキュリティソリューションのベータ版を提供しています。本記事では、Helmチャートを使用して本ソリューションを利用・デプロイする方法を説明します。

!!! warning "バージョン4.10に限定"
    WallarmのeBPFベースソリューションは現在、[Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/)で利用可能な機能のみをサポートします。

## トラフィックフロー

WallarmのeBPFベースソリューションにおけるトラフィックフロー：

![eBPFのトラフィックフロー](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

本eBPFソリューションは、次のプロトコルでのトラフィック監視に対応しています。

* HTTP/1.xまたはHTTP/2
* Proxy v1またはProxy v2

トラフィックはTLS/SSL暗号化またはプレーンテキストでのデータ転送を利用できます。SSLトラフィックの解析は、共有OpenSSLライブラリ（例：NGINX、HAProxy）を使用するサーバーに限定され、Envoyのような別のSSL実装を採用するサーバーでは利用できません。

## 動作概要

Linuxオペレーティングシステムはカーネルとユーザースペースで構成され、カーネルはハードウェアリソースと重要なタスクを管理し、アプリケーションはユーザースペースで動作します。この環境において、eBPF（Extended Berkeley Packet Filter）は、セキュリティに特化したものを含むカスタムプログラムをLinuxカーネル内で実行できるようにします。[eBPFの詳細はこちら](https://ebpf.io/what-is-ebpf/)

Kubernetesはプロセス分離、リソース管理、ネットワーキングなどの重要なタスクにLinuxカーネルの機能を活用するため、eBPFベースのセキュリティソリューションを統合するのに適した環境を提供します。これに沿って、Wallarmはカーネルの機能を活用し、Kubernetesとシームレスに統合するeBPFベースのセキュリティソリューションを提供します。

本ソリューションは、トラフィックのミラーを生成してWallarmノードに転送するエージェントで構成されます。デプロイ時に、ミラーの対象範囲をNamespaceまたはPodレベルで指定できます。Wallarmノードはミラーされたトラフィックをセキュリティ脅威の観点から検査しますが、不正なアクティビティをブロックはしません。代わりに、検知したアクティビティをWallarm Cloudに記録し、Wallarm Console UIを通じてトラフィックのセキュリティ可視化を提供します。

次の図は本ソリューションのコンポーネントを示します。

![eBPFのコンポーネント](../../../images/waf-installation/epbf/ebpf-components.png)

eBPFエージェントは、すべてのKubernetesワーカーノードにDaemonSetとしてデプロイされます。適切に機能させるため、エージェントコンテナは特権モードで実行し、必須のケーパビリティとして`SYS_PTRACE`と`SYS_ADMIN`を付与する必要があります。

さらに本ソリューションはレスポンスコードも処理し、Wallarmの中核モジュールである[API Discovery](../../../api-discovery/overview.md)がAPIエンドポイントを特定し、APIインベントリを構築して最新状態に保てるようにします。

## ユースケース

サポートされている[Wallarmのデプロイオプション](../../supported-deployment-options.md)の中で、本ソリューションはアウトオブバンド運用に推奨されます。インラインで動作するのではなくトラフィックのミラーコピーを取得することで、eBPFベースのソリューションはトラフィックの流れを中断させません。この方式により、本番トラフィックへの影響を最小化し、レイテンシに影響する余分な遅延の発生を回避します。

## 技術要件

eBPFソリューションを正常にデプロイするために、以下の技術的前提条件を満たしていることを確認してください。

* サポート対象のKubernetesバージョン：
  
    * AWS - Kubernetes 1.24以上
    * Azure - Kubernetes 1.26以上
    * GCP - 任意のKubernetesバージョン
    * ベアメタルサーバー - Kubernetes 1.22以上
* エージェントがキャプチャしたトラフィックを安全にWallarmの処理ノードへミラーリングできるよう、[cert-manager](https://cert-manager.io/docs/installation/helm/)がインストールされていること。
* [Helm v3](https://helm.sh/)パッケージマネージャー。
* BTF（BPF Type Format）が有効なLinuxカーネル5.10または5.15。対象OSはUbuntu、Debian、RedHat、Google COS、Amazon Linux 2です。
* x86_64アーキテクチャのプロセッサ。
* 本ソリューションはベータ版のため、すべてのKubernetesリソースを効果的にミラーできるわけではありません。そのため、Kubernetes内のNGINX Ingressコントローラ、Kong Ingressコントローラ、または通常のNGINXサーバーに対してトラフィックミラーリングを有効化することを推奨します。
* ご利用のユーザーアカウントはWallarm Consoleへの[**Administrator**アクセス](../../../user-guides/settings/users.md#user-roles)を持っている必要があります。

上記要件とユースケースが異なる場合は、環境に関する詳細な技術情報を添えて[セールスエンジニア](mailto:sales@wallarm.com)までご連絡ください。お客様の要件に合わせた調整の可能性を検討します。

## ネットワークアクセス

送信トラフィックが制限された環境でも本ソリューションが正しく機能するよう、以下の外部リソースへのアクセスを許可するようにネットワークを設定してください。

* `https://charts.wallarm.com`でWallarmのHelmチャートを追加します。
* Docker HubからWallarmのDockerイメージを取得するために`https://hub.docker.com/r/wallarm`。
* USのWallarm Cloudをご利用の場合は`https://us1.api.wallarm.com`。EUのWallarm Cloudをご利用の場合は`https://api.wallarm.com`。
* 攻撃検知ルールや[API仕様](../../../api-specification-enforcement/overview.md)の更新をダウンロードし、[許可リスト、拒否リスト、またはグレーリスト](../../../user-guides/ip-lists/overview.md)に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレス。

    --8<-- "../include/wallarm-cloud-ips.md"

## デプロイ

Wallarm eBPFソリューションをデプロイするには：

1. Wallarmノードを作成します。
1. WallarmのHelmチャートをデプロイします。
1. トラフィックミラーリングを有効化します。
1. Wallarm eBPFの動作をテストします。

### ステップ1：Wallarmノードを作成する

1. 以下のリンクからWallarm Console → **Nodes**を開きます。

    * https://us1.my.wallarm.com/nodes（USクラウド向け）
    * https://my.wallarm.com/nodes（EUクラウド向け）
1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
    
    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### ステップ2：WallarmのHelmチャートをデプロイする

1. 上記の要件を満たしており、[cert-manager](https://cert-manager.io/docs/installation/helm/)がインストールされていることを確認します。
1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します：
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm eBPFソリューションの構成](helm-chart-for-wallarm.md)に沿って`values.yaml`ファイルを作成します。

    最小構成の例：

    === "USクラウド"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EUクラウド"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>`はKubernetesで稼働させるWallarmノードのトークンです。

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. WallarmのHelmチャートをデプロイします：

    ``` bash
    helm install --version 0.10.28 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarm eBPFチャートのHelmリリース名です
    * `wallarm-ebpf`はWallarm eBPFチャートのHelmリリースをデプロイする新しいNamespaceであり、別のNamespaceにデプロイすることを推奨します
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### ステップ3：トラフィックミラーリングを有効化する

NGINX Ingressコントローラ、Kong Ingressコントローラ、または通常のNGINXサーバーでWallarmのeBPFベースソリューションを効果的に活用するため、トラフィックミラーリングを有効化することを推奨します。

デフォルトでは、デプロイ済みのソリューションはトラフィックを解析しません。トラフィック解析を有効にするには、以下のいずれかのレベルでトラフィックミラーリングを有効化する必要があります。

* Namespace単位
* Pod単位
* ノード名またはコンテナ単位

トラフィックミラーリングの有効化方法は2つあります。NamespaceラベルやPodアノテーションとして動的フィルタを使用する方法、または`values.yaml`ファイルの`config.agent.mirror.filters`ブロックで制御する方法です。これらを併用することもできます。[詳細](selecting-packets.md)

#### ラベルを用いたNamespace単位

Namespaceに対してミラーリングを有効化するには、Namespaceラベル`wallarm-mirror`を`enabled`に設定します：

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### アノテーションを用いたPod単位

Podに対してミラーリングを有効化するには、アノテーション`mirror.wallarm.com/enabled`を`true`に設定します：

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### values.yamlを用いたNamespace、Pod、コンテナ、またはノード単位

よりきめ細かな制御が必要な場合は、Wallarm eBPFの`values.yaml`ファイル内にある`config.agent.mirror.filters`ブロックでミラーリングのレベルを指定できます。フィルタの設定方法や、WallarmのNamespaceラベルおよびPodアノテーションとの相互作用については[記事](selecting-packets.md)をご参照ください。

### ステップ4：Wallarm eBPFの動作をテストする

Wallarm eBPFが正しく動作していることを確認するには：

1. WallarmのPod詳細を取得し、正常に起動していることを確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    各Podは、例えば次のように`READY: N/N`かつ`STATUS: Running`と表示されます：

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. アプリケーションに対してテスト用の[パストラバーサル](../../../attacks-vulns-list.md#path-traversal)攻撃を送信します。`<LOAD_BALANCER_IP_OR_HOSTNAME>`を、対象にトラフィックを転送するロードバランサの実IPアドレスまたはDNS名に置き換えて実行してください：

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    Wallarm eBPFソリューションはアウトオブバンド方式で動作するため、攻撃をブロックせず、検知のみを行います。

    攻撃が記録されたことを確認するには、Wallarm Console → Eventsに進みます：

    ![!インターフェイス上の攻撃](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## 制限事項

* アウトオブバンド（OOB）で動作し、実際のフローとは独立してトラフィックを解析する方式のため、本ソリューションにはいくつかの内在的な制約があります。

    * 悪意のあるリクエストを即時にブロックしません。Wallarmは攻撃を観測し、[Wallarm Consoleでの詳細](../../../user-guides/events/check-attack.md)を提供します。
    * 対象サーバーへの負荷を制限できないため、[レート制限](../../../user-guides/rules/rate-limiting.md)には対応していません。
    * [IPアドレスによるフィルタリング](../../../user-guides/ip-lists/overview.md)には対応していません。
* サーバーのレスポンスボディはミラーされないため：

    * [パッシブ検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)に基づく脆弱性検出には対応していません。
    * APIエンドポイントの[API Discoveryにおけるレスポンス構造の表示](../../../api-discovery/exploring.md#endpoint-details)には対応していません。

* ベータ版であるため、すべてのKubernetesリソースを効果的にミラーできるわけではありません。そのため、Kubernetes内のNGINX Ingressコントローラ、Kong Ingressコントローラ、または通常のNGINXサーバーに対してトラフィックミラーリングを有効化することを推奨します。