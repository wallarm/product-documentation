# セーフなノードアップグレードプロセスのための推奨事項

この文書では、Wallarmフィルタリングノードを4.6までセーフにアップグレードするための推奨事項と関連するリスクについて説明します。

## 一般的な推奨事項

* フィルタリングノードの更新プロセスを慎重に計画し、監督します。 Wallarmノードの新しいバージョンのリリース日は[Wallarmノードバージョニングポリシー](versioning-policy.md)で公開されています。
* あなたのインフラストラクチャに複数のWallarmノードがインストールされている場合、それらを段階的に更新します。 最初のノードを更新した後、そのノードのモジュール操作を一日中監視し、最初のノードが正しく動作していれば他のWallarmノードも段階的に更新します。
* 開発環境と生産環境が分離しているモデルでは、フィルタリングノードを段階的に更新します。 まず、新しいバージョンを非生産環境に適用し、テストし、次に生産環境に適用します。 詳細な推奨事項は、[分離環境でのWallarmノードの設定のための説明書](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes)に記載されています。
* フィルタリングノードのアップグレードを行う前に、利用可能な方法でノードを通るトラフィックのルーティングを無効にします（たとえば、[トラフィックフィルターモード](../admin-en/configure-wallarm-mode.md)を`off`に設定することにより）。
* フィルタリングノードのモジュールがアップグレードされたら、ノードフィルタモードを`監視`に設定します。すべてのモジュールが正常に動作しており、`監視`モードで一日中新しい誤検出の数が異常に多くない場合、フィルタリングノードを`ブロック`モードにします。
* Wallarmノードのアップデートを適用する前に、可能であればNGINXを最新バージョンに更新します。特定のバージョンのNGINXを使用する必要がある場合は、カスタムバージョンのNGINXのWallarmモジュールをビルドするために[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡して下さい。

## 可能なリスク

以下は、フィルタリングノードの更新時に発生する可能性のあるリスクです。 リスクの影響を軽減するために、更新時に適切なガイドラインに従ってください。

### 変更された機能

* [Wallarmノード4.6の新機能](what-is-new.md)
* [EOLノード（3.6以下）をアップグレードする場合の新機能](older-versions/what-is-new.md)

### 新しい誤検出

フィルタリングノードの新しいバージョンごとに、私たちはトラフィック解析を改善します。 つまり、新しいバージョンが増えるごとに誤検出の数が減ります。 ただし、各保護対象アプリケーションに独自の特性があるため、ブロックモード（`ブロック`）を有効にする前に、新しいバージョンのフィルタリングノードの動作を`監視`モードで分析することをお勧めします。

更新後の新しい誤検出の数を分析するには：

1. フィルタリングノードの新しいバージョンを`監視` [モード](../admin-en/configure-wallarm-mode.md)にデプロイし、トラフィックをフィルタリングノードに送信します。
2. 数時間経過後、Wallarmコンソール→**イベント**セクションを開き、誤って攻撃と認識されるリクエストの数を分析します。
3. 誤検出の数が異常に増加している場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。

### 使用リソースの増加

新しいフィルタリングノードの機能を一部使用すると、使用リソース量が変わる可能性があります。 使用リソース量の変更情報は、[新機能](what-is-new.md)セクションに記載されています。

また、フィルタリングノードの操作を監視することをお勧めします：実際の使用リソース量と文書に記載されている量との間に顕著な違いを発見した場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。

## 更新プロセス

Wallarmノードの更新プロセスは、プラットフォームとインストールフォームによって異なります。 インストール形態を選択し、適切な指示に従ってください：

* [NGINX、NGINX Plus用モジュール](nginx-modules.md)
* [NGINXまたはEnvoy用モジュールを備えたDockerコンテナ](docker-container.md)
* [統合されたWallarmモジュールを備えたNGINX Ingressコントローラ](ingress-controller.md)
* [統合されたWallarmモジュールを備えたKong Ingressコントローラ](kong-ingress-controller.md)
* [サイドカープロキシ](sidecar-proxy.md)
* [クラウドノードイメージ](cloud-image.md)
* [マルチテナントノード](multi-tenant.md)
* [CDNノード](cdn-node.md)
* [Wallarmノード2.18以下から4.6への許可リストと拒否リストの移行](migrate-ip-lists-to-node-3.md)