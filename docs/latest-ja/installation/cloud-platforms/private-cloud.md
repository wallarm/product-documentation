[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# プライベートクラウドにWallarmを展開する

プライベートクラウドとは、単一の組織またはエンティティ専用に展開されるクラウド環境であり、リソースの専用利用と制御が可能です。本記事では、プライベートクラウドへのWallarmノードの展開原則について概説します。

## ステップ1: Wallarm展開における範囲とアプローチの理解

プライベートクラウドにWallarmを展開する前に、アプリケーション全体の範囲を把握し、Wallarm展開に最も適したアプローチを決定することが重要です。この評価の際、以下の特徴を考慮してください。

* 保護すべき範囲の評価: アプリケーション全体を評価し、保護が必要な重要なアプリケーションを特定します。データの機密性、違反がもたらす潜在的な影響、コンプライアンス要件などの要因を考慮してください。この評価により、プライベートクラウド内で最も重要な資産の保護に対して優先順位を付け、取り組みを集中できます。
* [In-line](../inline/overview.md)対[Out-of-band(OOB)](../oob/overview.md)分析: インライン分析かアウトオブバンド分析かを検討し、どちらの方法でWallarmを展開するか決定してください。インライン分析は、Wallarmノードをアプリケーションのトラフィックパス上に配置することを意味し、OOB分析はミラーされたトラフィックをキャプチャして分析することを指します。
* Wallarmノードの配置: 選択したアプローチ（インラインまたはOOB分析）に基づき、プライベートクラウドインフラ内でのWallarmノードの適切な配置を決定してください。インライン分析の場合、同一VLANまたはサブネット内など、アプリケーションに近い場所にWallarmノードを配置することを検討してください。OOB分析の場合、ミラーリングされたトラフィックが適切にWallarmノードへルーティングされ、分析されることを確認してください。

## ステップ2: Wallarmのアウトゴーイング接続を許可する

プライベートクラウドでは、アウトゴーイング接続に制限がある場合があります。Wallarmが正しく機能するためには、インストール時のパッケージダウンロード、ローカルノードインスタンスとWallarm Cloud間のネットワーク接続の確立、およびWallarm機能の全面的な運用化を可能にするため、アウトゴーイング接続を有効にする必要があります。

プライベートクラウドではアクセスは通常IPアドレスに基づいて許可されます。Wallarmは以下のDNSレコードへのアクセスを必要とします:

* Wallarm Cloudへアクセスし、セキュリティルールの取得、攻撃データのアップロードなどを行うために、以下のアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* DockerイメージからWallarmを実行する場合、Docker Hubで使用されるIPアドレス。
* `35.244.197.238` (`https://meganode.wallarm.com`)は、[all‑in‑one installer](../nginx/all-in-one.md)からWallarmをインストールするために使用されます。インストーラーはこのアドレスからダウンロードされます。
* 以下のIPアドレスは、攻撃検出ルールおよび[API仕様][api-spec-enforcement-docs]のアップデートをダウンロードし、さらに[許可リスト、拒否リスト、またはグレイリスト][ip-lists-docs]された国、地域、またはデータセンターの正確なIPを取得するために使用されます。

    --8<-- "../include/wallarm-cloud-ips.md"

## ステップ3: 展開モデルおよびWallarmアーティファクトの選択

Wallarmは柔軟な展開モデルを提供し、組織がプライベートクラウド環境に最適なオプションを選択できるようにします。一般的な展開モデルとして、**仮想アプライアンス展開**と**Kubernetes展開**の2種類があります。

### 仮想アプライアンス展開

このモデルでは、プライベートクラウドインフラ内に仮想アプライアンスとしてWallarmを展開します。仮想アプライアンスはVMまたはコンテナとしてインストールできます。Wallarmノードの展開には、以下のアーティファクトのいずれかを選択できます:

* Dockerイメージ:
    * [NGINXベースのDockerイメージ](../../admin-en/installation-docker-en.md)
    * [EnvoyベースのDockerイメージ](../../admin-en/installation-guides/envoy/envoy-docker.md)
* [Linux向けAll‑in‑Oneインストーラー](../nginx/all-in-one.md)

### Kubernetes展開

プライベートクラウドでコンテナオーケストレーションにKubernetesを利用している場合、WallarmはKubernetesネイティブなソリューションとして展開できます。Kubernetesクラスターとシームレスに統合し、Ingressコントローラー、サイドカーコンテナ、またはカスタムKubernetesリソースなどの機能を活用します。Wallarmの展開には、以下のソリューションのいずれかを選択できます:

* [NGINXベースのIngressコントローラー](../../admin-en/installation-kubernetes-en.md)
* [KongベースのIngressコントローラー](../kubernetes/kong-ingress-controller/deployment.md)
* [サイドカーコントローラー](../kubernetes/sidecar-proxy/deployment.md)