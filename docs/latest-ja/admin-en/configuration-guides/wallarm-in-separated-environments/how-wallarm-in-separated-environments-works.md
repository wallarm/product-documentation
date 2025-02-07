# 分離環境におけるフィルタリングノードの動作

アプリケーションは、production、staging、testing、developmentなどいくつかの環境にデプロイできます。本記事では、さまざまな環境向けにフィルタリングノードを管理するための推奨方法について説明します。

## 環境とは

環境の定義は企業によって異なる場合がありますが、本記事では下記の定義を使用します。

**環境**とは、異なる目的（production、staging、testing、developmentなど）のためにサービスされる計算資源のセットまたはサブセットであり、ネットワーク／ソフトウェア構成、ソフトウェアバージョン、監視、変更管理などのポリシーを同一または異なるチーム（SRE、QA、Developmentなど）が管理するものです。

ベストプラクティスの観点から、1つのプロダクトバーティカル（development、testing、staging、production段階）で使用されるすべての環境でWallarmノードの設定を同期させておくことが推奨されます。

## 関連するWallarmの機能

異なる環境向けにフィルタリングノードの設定を管理し、フィルタリングノードの変更を段階的に展開するための主な機能は以下の3点です：

* [リソース識別](#resource-identification)
* [Wallarmアカウントとサブアカウントの分離](#separate-wallarm-accounts-and-sub-accounts)
* [フィルタリングノード動作モード](../../configure-wallarm-mode.md)

### リソース識別

識別を使用して特定の環境向けにフィルタリングノードを設定する方法は2通りあります：

* 各環境ごとのWallarmユニークID、
* 環境ごとに異なるURLドメイン名（既にアーキテクチャに設定済みの場合）。

#### IDによる環境識別

Applicationsの概念を利用することで、保護対象の各環境に異なるIDを割り当て、環境ごとにフィルタリングノードのルールを個別に管理できます。

フィルタリングノードを設定する際、Applicationsの概念を使用して各環境のWallarm IDを追加できます。IDを設定するには：

1. Wallarmアカウントの → **Settings** → **Applications** セクションに環境名とそのIDを追加します。

    ![Added environments](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/added-applications.png)
2. フィルタリングノードにID設定を指定します：

    * Linuxベース、Kubernetesサイドカー、Docker‑basedデプロイメントの場合は、[`wallarm_application`](../../configure-parameters-en.md#wallarm_application) ディレクティブを使用します;
    * Kubernetes NGINX Ingressコントローラーのデプロイメントの場合は、[`nginx.ingress.kubernetes.io/wallarm-application`](../../configure-kubernetes-en.md#ingress-annotations) アノテーションを使用します。これにより、新しいフィルタリングノードルールを作成する際に、特定のアプリケーションIDのセットにルールを割り当てることが可能になります。属性が指定されていない場合、新しいルールはWallarmアカウント内のすべての保護対象リソースに自動的に適用されます。

![Creating rule for ID](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-id.png)

#### ドメインによる環境識別

各環境で`HOST` HTTPリクエストヘッダーに異なるURLドメイン名が使用されている場合、ドメイン名を各環境のユニーク識別子として使用することが可能です。

この機能を使用するには、各設定済みフィルタリングノードルールに対して適切な`HOST`ヘッダーの指定を追加してください。以下の例では、`HOST`ヘッダーが`dev.domain.com`の場合にのみルールがトリガーされます：

![Creating rule for HOST](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-host.png)

### Wallarmアカウントとサブアカウントの分離

異なる環境のフィルタリングノード設定を分離する簡単な方法の1つは、各環境または環境群ごとに別々のWallarmアカウントを使用することです。このベストプラクティスは、Amazon AWSをはじめとする多くのクラウドサービスベンダーによって推奨されています。

複数のWallarmアカウント管理を簡素化するために、論理的な`master` Wallarmアカウントを作成し、他のWallarmアカウントを`master`アカウントのサブアカウントとして割り当てることが可能です。この方法により、1つのコンソールUIおよびAPI認証情報を使用して、組織が保有するすべてのWallarmアカウントを管理できます。

`master`アカウントおよびサブアカウントを有効にするには、[Wallarm's Technical Support](mailto:support@wallarm.com)チームにお問い合わせください。この機能を利用するには、別途Wallarmエンタープライズライセンスが必要です。

!!! warning "既知の制限事項"
    * 同じWallarmアカウントに接続されているすべてのフィルタリングノードは、同一のトラフィックフィルトレーションルールを受信します。適切な[アプリケーションIDまたはユニークHTTPリクエストヘッダー](#resource-identification)を使用することで、異なるアプリケーションに対して異なるルールを適用することは可能です。
    * フィルタリングノードが自動的にIPアドレスをブロックする（例えば、IPアドレスからの攻撃ベクトルが3回以上検出された場合）と、システムはWallarmアカウント内のすべてのアプリケーションに対してそのIPをブロックします。