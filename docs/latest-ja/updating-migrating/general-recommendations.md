# 安全なノードアップグレード推奨事項

本書はWallarm Nodesの安全なアップグレードのための推奨事項および関連するリスクについて説明します。

## 一般的な推奨事項

* フィルタリングノードの更新プロセスを慎重に計画および監視してください。新しいWallarm Nodesバージョンの予定リリース日は[Wallarm node versioning policy](versioning-policy.md)に記載されています。
* インフラに複数のWallarm Nodesがインストールされている場合は、段階的にアップデートしてください。まず最初のノードを更新し、そのノードモジュールの動作を1日以内に監視し、問題がなければ他のWallarm Nodesを段階的に更新してください。
* 開発環境と本番環境が分離されているモデルの場合は、フィルタリングノードを段階的にアップデートしてください。まず非本番環境で新バージョンを適用およびテストし、その後本番環境で更新してください。詳細な推奨事項は[分離環境用Wallarm nodesの設定手順](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes)に記載されています。
* フィルタリングノードをアップグレードする前に、利用可能な任意の方法でノードを通るトラフィックルーティングを無効にしてください（例：[traffic filtration mode](../admin-en/configure-wallarm-mode.md)を`off`に設定するなど）。
* フィルタリングノードモジュールをアップグレード後、ノードのフィルトレーションモードを`monitoring`に設定してください。すべてのモジュールが正常に動作し、1日以内に`monitoring`モードで異常な数の新規誤検知が発生しなかった場合、フィルタリングノードを`block`モードに切り替えてください。
* もし[NGINX node](../installation/nginx-native-node-internals.md#nginx-node)を使用している場合は、Wallarm Nodeのアップデートを適用する前に、NGINXを利用可能な最新版にアップグレードしてください。特定のバージョンのNGINXを使用する必要がある場合は、カスタムバージョンのNGINX向けにWallarmモジュールを構築するために[Wallarm technical support](mailto:support@wallarm.com)にお問い合わせください。

## 発生する可能性のあるリスク

以下はフィルタリングノード更新時に発生する可能性のあるリスクです。リスクの影響を軽減するために、更新時は適切なガイドラインに従ってください。

### 機能変更

* [Wallarm Node 5.xおよび0.xの新機能](what-is-new.md)
* [EOLノード（3.6以下）アップグレード時の新機能](older-versions/what-is-new.md)

### 新たな誤検知

フィルタリングノードは各新バージョンごとにトラフィック解析が改善され、誤検知の数が減少します。しかし、保護される各アプリケーションには固有の特性があるため、新バージョンのフィルタリングノードを`monitoring`モードで動作させ、その結果を十分に確認してから`block`モードを有効にすることを推奨します。

更新後の新たな誤検知数を分析するには、以下の手順を実行してください：

1. フィルタリングノードの新バージョンを`monitoring`[mode](../admin-en/configure-wallarm-mode.md)で展開し、トラフィックをフィルタリングノードに送信してください。
2. しばらくしてからWallarm Console→**Attacks**セクションを開き、誤って攻撃と認識されたリクエスト数を確認してください。
3. 誤検知数に異常な増加が見られる場合は、[Wallarm technical support](mailto:support@wallarm.com)にお問い合わせください。

### 使用リソースの増加

新しいフィルタリングノード機能の一部は、使用リソース量に変化を引き起こす可能性があります。使用リソース量の変化に関する情報は[What is new](what-is-new.md)セクションで強調されています。

また、フィルタリングノードの運用状況を監視することも推奨します。実際の使用リソース量とドキュメントに記載された量に大幅な差異がある場合は、[Wallarm technical support](mailto:support@wallarm.com)にお問い合わせください。

## アップデートプロセス

Wallarm Nodeのアップデートプロセスはプラットフォームおよびインストール形態に依存します。該当するインストール形態を選択し、適切な手順に従ってください：

* NGINX Node:
  
    * [NGINX、NGINX Plus用モジュール](nginx-modules.md)
    * [All-in-oneインストーラー](all-in-one.md)
    * [NGINXまたはEnvoy用モジュールを搭載したDockerコンテナ](docker-container.md)
    * [統合Wallarmモジュール搭載のNGINX Ingressコントローラー](ingress-controller.md)
    * [Sidecar](sidecar-proxy.md)
    * [Cloudノードイメージ](cloud-image.md)
    * [マルチテナントノード](multi-tenant.md)
    * [Wallarm Node 2.18以下から5.0へのallowlist及びdenylistの移行](migrate-ip-lists-to-node-3.md)
* Native Node:
  
    * [All-in-oneインストーラー](native-node/all-in-one.md)
    * [Helmチャート](native-node/helm-chart.md)
    * [Dockerイメージ](native-node/docker-image.md)