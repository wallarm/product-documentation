[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# プライベートクラウドでのWallarmの展開方法

プライベートクラウドは、特定の組織またはエンティティだけに展開されるクラウド環境であり、リソースに対する独占的な利用と管理が可能です。この記事では、プライベートクラウドにWallarmノードを展開する手法の概要を説明します。

## Step 1: Wallarmの展開に対する認識と取り組み方を理解する

プライベートクラウドでWallarmを展開する前に、アプリケーション環境の範囲を理解し、Wallarmの展開に最適なアプローチを決定することが重要です。次の特性を評価中に考慮してください：

* セキュリティを確保するための範囲の評価: アプリケーションの状況を評価し、保護が必要な重要なアプリケーションを特定します。データの感度、侵害の影響、準拠要件などの要素を考慮しましょう。この評価は、プライベートクラウド内の最も重要な資産を保護するための取り組みを優先し、焦点を絞るのに役立ちます。
* [インライン](../inline/overview.md) vs. [アウトオブバンド (OOB)](../oob/overview.md) 解析: Wallarmをインライン解析またはアウトオブバンドトラフィック解析のために展開したいかどうかを決定します。インライン解析では、Wallarmノードをアプリケーションのトラフィックパスに展開することが含まれます。一方、OOB解析では、ミラーリングされたトラフィックをキャプチャして解析します。
* Wallarmノードの配置: 選択した方法（インラインまたはOOB解析）に基づき、プライベートクラウドインフラストラクチャ内でのWallarmノードの適切な配置を決定します。 インライン解析の場合、アプリケーションの近く、例えば同じVLANやサブネット内にWallarmノードを配置することを考慮してください。OOB解析の場合、ミラーリングされたトラフィックが正しくWallarmノードにルーティングされ、解析されるようにします。

## Step 2: Wallarm用に外部接続を許可する

プライベートクラウドでは、外部への接続に制限があることが多いです。Wallarmが正しく動作するためには、インストール中にパッケージをダウンロードしたり、ローカルのノードインスタンスとWallarm Cloud間でネットワーク接続を確立したり、Wallarmの機能を完全に稼働させたりするために、外部接続を有効にする必要があります。

通常、プライベートクラウドへのアクセスはIPアドレスに基づいて許可されます。Wallarmは以下のDNSレコードへのアクセスが必要です：

* `35.235.66.155` アメリカ合衆国のWallarm Cloud (`us1.api.wallarm.com`) へのアクセスを許可して、セキュリティルールを取得し、攻撃データをアップロードします。
* `34.90.110.226` ヨーロッパのWallarm Cloud (`api.wallarm.com`)へのアクセスを許可して、セキュリティルールを取得し、攻撃データをアップロードします。
* DockerイメージからWallarmを実行する場合には、Docker Hubを使用するIPアドレス。
* `34.111.12.147` (`repo.wallarm.com`): [NGINX stable](../nginx/dynamic-module.md)/[NGINX Plus](../nginx-plus.md)/[ディストリビューション供給のNGINX](../nginx/dynamic-module-from-distr.md) に対する個別のLinuxパッケージからWallarmノードをインストールする場合。ノードのインストール用のパッケージは、このアドレスからダウンロードされます。
* `35.244.197.238` (`https://meganode.wallarm.com`): [オールインワンインストーラ](../nginx/all-in-one.md) からWallarmをインストールする場合。インストーラーは、このアドレスからダウンロードされます。
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```

## Step 3: 展開モデルとWallarmアーティファクトを選択する

Wallarmは柔軟な展開モデルを提供しており、組織はプライベートクラウド環境に最も適したオプションを選択することができます。一般的な展開モデルとしては、**仮想アプライアンスの展開**と**Kubernetesの展開**があります。

### 仮想アプライアンスの展開

このモデルでは、プライベートクラウドインフラストラクチャ内でWallarmを仮想アプライアンスとして展開します。仮想アプライアンスはVMまたはコンテナとしてインストールできます。次のアーティファクトのいずれかを使用してWallarmノードを展開することができます：

* Dockerイメージ：
    * [NGINXベースのDockerイメージ](../../admin-en/installation-docker-en.md)
    * [EnvoyベースのDockerイメージ](../../admin-en/installation-guides/envoy/envoy-docker.md)
* Linuxパッケージ：
    * [NGINX stableベースの個別Linuxパッケージ](../nginx/dynamic-module.md)
    * [NGINX Plusベースの個別Linuxパッケージ](../nginx-plus.md)
    * [ディストリビューション供給のNGINXベースの個別Linuxパッケージ](../nginx/dynamic-module-from-distr.md)
    * [Linux用のオール―イン―ワン インストーラ  ](../nginx/all-in-one.md)

### Kubernetesの展開

プライベートクラウドがコンテナオーケストレーションのためにKubernetesを利用している場合、WallarmはKubernetesネイティブなソリューションとして展開することができます。これは、他のIngressコントローラーやサイドカープロキシ、或いはカスタムKubernetesリソースを活用し、Kubernetesクラスターと継ぎ目なく統合することができます。以下のソリューションのいずれかを使用してWallarmを展開することができます：

* [NGINX ベースのIngress コントローラ  ](../../admin-en/installation-kubernetes-en.md)
* [Kong ベースのIngressコントローラ](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecar コントローラ](../kubernetes/sidecar-proxy/deployment.md)