[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm の eBPF ベースのソリューション (ベータ版)

Wallarm は、Linux カーネルの力を活用し、Kubernetes 環境とシームレスに統合する eBPF ベースのセキュリティソリューションのベータ版を提供しています。この記事では、Helm チャートを使用してソリューションを使用および展開する方法について説明します。

## トラフィックの流れ

Wallarm の eBPF ベースのソリューションによるトラフィックの流れです：

![eBPF トラフィックの流れ](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

eBPF ソリューションは、以下のプロトコルを使用してトラフィックをモニタリングするように設計されています：

* HTTP 1.x または HTTP 2
* Proxy v1 または Proxy v2

トラフィックは、TLS/SSL 暗号化またはプレーンテキストデータ転送を利用することができます。SSL トラフィックの分析は、共有 OpenSSL ライブラリ（例：NGINX、HAProxy）を使用するサーバーに限定され、Envoy などの他の SSL 実装を採用するサーバーでは利用できません。

## 動作原理

Linux オペレーティングシステムは、カーネルとユーザースペースで構成され、カーネルがハードウェアリソースと重要なタスクを管理し、アプリケーションがユーザースペースで動作します。この環境内で、eBPF (Extended Berkeley Packet Filter) は、セキュリティに焦点を当てたプログラムを含む、Linux カーネル内でのカスタムプログラムの実行を可能にします。[eBPF についてもっと読む](https://ebpf.io/what-is-ebpf/)

Kubernetes は、プロセスの分離、リソース管理、およびネットワーキングなどの重要なタスクに Linux カーネルの機能を利用しているため、eBPF ベースのセキュリティソリューションを統合するための良好な環境を提供します。このことに伴い、Wallarm は、カーネルの機能を活用し、Kubernetes とシームレスに統合する eBPF ベースのセキュリティソリューションを提供しています。

ソリューションは、トラフィックミラーを生成し、Wallarm ノードに転送するエージェントで構成されています。展開中に、ミラーレベルをネームスペースまたはポッドレベルで指定することができます。Wallarm ノードは、ミラー化されたトラフィックを分析してセキュリティ脅威を検出しますが、悪意のある活動をブロックすることはありません。代わりに、検出された活動を Wallarm Cloud に記録し、Wallarm Console UI を通じてトラフィックのセキュリティに関する可視性を提供します。

以下の図は、ソリューションのコンポーネントを示しています：

![eBPF コンポーネント](../../../images/waf-installation/epbf/ebpf-components.png)

eBPF エージェントは、すべての Kubernetes ワーカーノード上で DaemonSet として展開されます。適切な機能を確保するために、エージェントコンテナは、`SYS_PTRACE` および `SYS_ADMIN` の重要な機能を持つ特権モードで実行する必要があります。

さらに、このソリューションは、応答コードを処理し、Wallarm の主要な [API Discovery](../../../api-discovery/overview.md) モジュールが API エンドポイントを特定し、API インベントリを構築して最新の状態を保つことを支援します。

## 使用例

すべてのサポートされている [Wallarm の展開オプション](../../supported-deployment-options.md) の中で、このソリューションは、アウトオブバンド操作に推奨されるものです。ミラー化されたトラフィックのコピーをキャプチャすることで、eBPF ベースのソリューションは、トラフィックの流れを中断せずに確保します。このアプローチは、ライブトラフィックへの影響を最小限に抑え、遅延に影響を与える可能性のある追加の遅延を回避します。

## 技術要件

eBPF ソリューションの成功した展開に必要な以下の技術的前提条件を確保してください：

* サポートされる Kubernetes バージョン：
  
    * AWS - Kubernetes 1.24 以上
    * Azure - Kubernetes 1.26 以上
    * GCP - Kubernetes バージョンに制限なし
    * ベアメタルサーバー - Kubernetes 1.22 以上
* エージェントがセキュアな方法でキャプチャしたトラフィックを Wallarm 処理ノードにミラーリングできるようにするために、[cert-manager](https://cert-manager.io/docs/installation/helm/) がインストールされていること。
* [Helm v3](https://helm.sh/) パッケージマネージャー。
* Linux カーネルバージョン 5.10 または 5.15 で BTF (BPF Type Format) が有効化されていること。Ubuntu、Debian、RedHat、Google COS、または Amazon Linux 2 でサポートされています。
* x86_64 アーキテクチャのプロセッサ。
* ソリューションがベータ版である間、すべての Kubernetes リソースを効果的にミラーリングすることはできません。したがって、Kubernetes での NGINX Ingress コントローラー、Kong Ingress コントローラー、または通常の NGINX サーバーについて特に、トラフィックのミラーリングを有効にすることをお勧めします。
* あなたのユーザーアカウントは、Wallarm コンソールに [**管理者** アクセス](../../../user-guides/settings/users.md#user-roles) 権限を持つ必要があります。

リストされた要件と異なる使用例を持っている場合は、環境に関する詳細な技術情報を提供して、お問い合わせ先[セールスエンジニア](mailto:sales@wallarm.com)までご相談ください。あなたの特定のニーズに合わせて調整を検討するためです。

## ネットワークアクセス

送信トラフィックが制限された環境でソリューションが正しく機能するためには、以下の外部リソースへのネットワークアクセスを許可するように設定してください：

* `https://charts.wallarm.com` で Wallarm Helm チャートを追加する。
* `https://hub.docker.com/r/wallarm` から Wallarm Docker イメージを Docker Hub から取得する。
* 米国 Wallarm Cloud を利用するユーザーのためには、`https://us1.api.wallarm.com` へのアクセス。EU Wallarm Cloud を利用するユーザーのためには、`https://api.wallarm.com` へのアクセス。

## 展開

Wallarm の eBPF ソリューションを展開するには：

1. Wallarm ノードを作成する。
1. Wallarm Helm チャートを展開する。
1. トラフィックミラーリングを有効にする。
1. Wallarm の eBPF が正しく動作していることをテストする。

### ステップ 1: Wallarm ノードの作成

1. 以下のリンク経由で Wallarm コンソール → **ノード** を開きます：

    * 米国クラウドの場合は https://us1.my.wallarm.com/nodes
    * EU クラウドの場合は https://my.wallarm.com/nodes
1. **Wallarm ノード** タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
    
    ![!Wallarm ノードの作成](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### ステップ 2: Wallarm Helm チャートの展開

1. 上記の要件を満たしていることを確認し、[cert-manager](https://cert-manager.io/docs/installation/helm/) がインストールされていることを確認してください。
1. [Wallarm チャートリポジトリ](https://charts.wallarm.com/) を追加します：
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm eBPF ソリューション構成](helm-chart-for-wallarm.md) とともに `values.yaml` ファイルを作成します。

    最小構成のファイルの例：

    === "米国クラウド"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EU クラウド"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>` は、Kubernetes で実行される Wallarm ノードのトークンです。

    --8<-- "../include-ja/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm チャートを展開します：

    ``` bash
    helm install --version 0.10.23 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` は Wallarm eBPF チャートの Helm リリースの名前です
    * `wallarm-ebpf` は Wallarm eBPF チャートの Helm リリースを展開するための新しい名前空間であり、別の名前空間に展開することを推奨します
    * `<PATH_TO_VALUES>` は `values.yaml` ファイルへのパスです

### ステップ 3: トラフィックミラーリングを有効にする

Wallarm の eBPF ベースのソリューションを効果的に利用するために、NGINX Ingress コントローラー、Kong Ingress コントローラー、または通常の NGINX サーバーのトラフィックミラーリングを有効にすることを推奨します。

デフォルトでは、展開されたソリューションはトラフィックを分析しません。トラフィック分析を有効にするには、希望するレベルでトラフィックミラーリングを有効にする必要があります。これには：

* 名前空間のために
* ポッドのために
* ノード名またはコンテナーのために

トラフィックミラーリングを有効にする方法は2つあります：名前空間ラベルとしての動的フィルターを使用するか、`values.yaml` ファイルの `config.agent.mirror.filters` ブロックを介して制御するかです。これらのアプローチを組み合わせることもできます。[詳細情報](selecting-packets.md)

#### ラベルを使用して名前空間のために

ミラーリングを名前空間に対して有効にするには、名前空間ラベル `wallarm-mirror` を `enabled` に設定します：

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### アノテーションを使用してポッドのために

ポッドに対してミラーリングを有効にするには、`mirror.wallarm.com/enabled` アノテーションを `true` に設定します：

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### `values.yaml`を使用して名前空間、ポッド、コンテナー、またはノードのために

より詳細な制御のために、Wallarm eBPF の `values.yaml` ファイルの `config.agent.mirror.filters` ブロックを使用して、ミラーリングレベルを指定することができます。フィルターの設定方法と、Wallarm 名前空間ラベルおよびポッドアノテーションとのやり取りに関する[記事](selecting-packets.md)を読んでください。

### ステップ 4: Wallarm の eBPF 操作をテストする

Wallarm の eBPF が正しく動作していることをテストするために：

1. Wallarm ポッドの詳細を取得して、正常に起動していることを確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    各ポッドは次のように表示されます：**READY: N/N** および **STATUS: Running**、例えば：

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. 実際の IP アドレスまたはロードバランサーの DNS 名に `<LOAD_BALANCER_IP_OR_HOSTNAME>` を置き換えて、アプリケーションに対してテスト [パストラバーサル](../../../attacks-vulns-list.md#path-traversal) 攻撃を送信します：

    ```bash
    curl https://<LOAD_BALANCER