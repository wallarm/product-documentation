# 安全なWallarm Nodeのアップグレードに関する推奨事項

本書では、Wallarm Nodeを安全にアップグレードするための推奨事項と関連リスクを説明します。

## 一般的な推奨事項

* フィルタリングノードの更新プロセスを慎重に計画し、監視します。Wallarm Nodeの新バージョンの予定リリース日は[Wallarm Nodeのバージョン管理ポリシー](versioning-policy.md)に掲載しています。
* インフラストラクチャに複数のWallarm Nodeがインストールされている場合は、段階的に更新します。最初のノードを更新した後は、1日間ノードモジュールの動作を監視し、最初のノードが正しく動作している場合は、他のWallarm Nodeを段階的に更新します。
* 開発環境と本番環境が分かれている場合は、フィルタリングノードを段階的に更新します。まず非本番環境で新バージョンを適用・テストし、その後に本番環境で適用します。
* フィルタリングノードをアップグレードする前に、利用可能な任意の方法でノード経由のトラフィックルーティングを無効化します（例えば、[トラフィックフィルタリングモード](../admin-en/configure-wallarm-mode.md)を`off`に設定するなど）。
* フィルタリングノードモジュールをアップグレードしたら、ノードのフィルタリングモードを`monitoring`に設定します。すべてのモジュールが正しく動作し、1日間`monitoring`モードで新しい誤検知が異常に増加していない場合は、フィルタリングノードを`block`モードに切り替えます。
* [NGINXノード](../installation/nginx-native-node-internals.md#nginx-node)を使用している場合は、Wallarm Nodeの更新を適用する前にNGINXを利用可能な最新バージョンにアップグレードします。インフラストラクチャで特定のNGINXバージョンを使用する必要がある場合は、カスタム版NGINX向けのWallarmモジュールのビルドについて[Wallarmテクニカルサポート](mailto:support@wallarm.com)にお問い合わせください。

## 想定されるリスク

以下は、フィルタリングノードを更新する際に発生する可能性のあるリスクです。リスクの影響を軽減するため、更新時は該当するガイドラインに従ってください。

### 機能の変更

* [Wallarm Node 6.xおよび0.14.x+の新機能と変更点](what-is-new.md)
* [EOLノード（3.6以下）をアップグレードする場合の新機能と変更点](older-versions/what-is-new.md)

### 新規誤検知

フィルタリングノードの各新バージョンではトラフィック解析を改善しています。つまり、新バージョンごとに誤検知の数は減少します。ただし、保護対象の各アプリケーションには固有の特性があるため、ブロッキングモード（`block`）を有効にする前に、`monitoring`モードで新バージョンのフィルタリングノードの挙動を分析することをお勧めします。

更新後の新規誤検知数を分析するには：

1. 新バージョンのフィルタリングノードを`monitoring`[モード](../admin-en/configure-wallarm-mode.md)でデプロイし、フィルタリングノードにトラフィックを流します。
2. 一定時間後に、Wallarm Console → Attacksセクションを開き、攻撃として誤って認識されたリクエスト数を分析します。
3. 誤検知数の異常な増加を確認した場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。

### 使用リソース量の増加

一部の新しいフィルタリングノード機能の使用により、使用リソース量が変化する場合があります。使用リソース量の変更に関する情報は、[新機能と変更点](what-is-new.md)セクションに記載しています。

また、フィルタリングノードの動作を監視することをお勧めします。実際の使用リソース量とドキュメント記載値に大きな差異がある場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にお問い合わせください。

## 更新手順

Wallarm Nodeの更新手順は、プラットフォームとインストール形態によって異なります。インストール形態を選択し、該当する手順に従ってください：

* NGINXノード：

    * [NGINX、NGINX Plus向けモジュール](nginx-modules.md)
    * [All-in-oneインストーラー](all-in-one.md)
    * [NGINXモジュール入りのDockerコンテナ](docker-container.md)
    * [Wallarmモジュール統合済みのNGINX Ingress Controller](ingress-controller.md)
    * [Sidecar](sidecar-proxy.md)
    * [クラウドノードイメージ](cloud-image.md)
    * [マルチテナントノード](multi-tenant.md)
    * [Wallarm Node 2.18以下から6.xへの許可リストと拒否リストの移行](migrate-ip-lists-to-node-3.md)
* ネイティブノード：

    * [All-in-oneインストーラー](native-node/all-in-one.md)
    * [Helmチャート](native-node/helm-chart.md)
    * [Dockerイメージ](native-node/docker-image.md)