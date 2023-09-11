# Wallarmノード4.6での新機能

新しいWallarmノードのマイナーバージョンがリリースされました！これには、DoS攻撃、総当たり攻撃、APIの過度な使用を防ぐための重要なAPIレート制限機能が含まれています。この文書からリリースされたすべての変更を学びましょう。

## オールインワンインストーラー

さまざまな環境でNGINXの動的モジュールとしてWallarmノードをインストールおよびアップグレードする際には、インストールプロセスを合理化し、標準化するために設計された**オールインワンインストーラー**を使用できます。このインストーラーは、自動的にオペレーティングシステムとNGINXのバージョンを識別し、必要なすべての依存関係をインストールします。

インストーラーは、以下の操作を自動的に実行することでプロセスを簡素化します：

1. あなたのOSとNGINXバージョンをチェックします。
1. 検出されたOSとNGINXバージョンのためのWallarm リポジトリを追加します。
1. これらのリポジトリからWallarm パッケージをインストールします。
1. インストールされたWallarm モジュールをあなたのNGINXに接続します。
1. 提供されたトークンを使用して、フィルタリングノードをWallarm Cloudに接続します。

[オールインワンインストーラーでノードをデプロイする方法の詳細を参照 →](../installation/nginx/all-in-one.md)

## レート制限

適切なレート制限の欠如は、APIのセキュリティにとって大きな問題であり、攻撃者が高ボリュームのリクエストを送信してサービスを拒否（DoS）させるか、システムをオーバーロードさせることができ、正当なユーザーに影響を与えます。

Wallarmノード4.6以降でサポートされるWallarmのレート制限機能を使用すると、セキュリティチームはサービスの負荷を効果的に管理し、サービスが正当なユーザーにとって利用可能で安全であることを確保できます。この機能は、リクエストとセッションのパラメータに基づいて各種の接続制限を提供し、従来のIPベースのレート制限、JSONフィールド、base64エンコードデータ、クッキー、XMLフィールドなどを含みます。

たとえば、各ユーザーのAPI接続を制限して、1分あたり何千ものリクエストを送信することを防ぐことができます。これはサーバーに重大な負荷をかけ、サービスがクラッシュする可能性があります。レート制限を実装することにより、サーバーをオーバーロードから保護し、すべてのユーザーがAPIに公平にアクセスできることを保証することができます。

Wallarm Console UI → **ルール** → **レート制限の設定**で、あなたの特定の使用ケース向けにレート制限範囲、レート、バースト、遅延、応答コードを指定することにより、レート制限を簡単に設定できます。

[レート制限設定のガイド →](../user-guides/rules/rate-limiting.md)

## メールとパスワードに基づくノードの登録の廃止

Wallarmノード4.6のリリースとともに、クラウドでのWallarmノードのメールとパスワードに基づく登録が廃止されました。このメソッドはバージョン4.0のリリース時に廃止され、ほとんどの顧客が新しい登録方法に移行しています。まだ行っていない場合は、Wallarmノード4.6以降を続行するために、必ずトークンベースのノード登録方法に切り替える必要があります。

バージョン4.6以降のノードは、Wallarm Cloudへのより安全で迅速な接続を保証するトークンを使用した登録のみ可能です。各移行ガイドには、トークンベースのノード登録方法への移行を支援するための指示が提供されています。

ノード登録方法の変更は、ノードタイプの更新をもたらすときもあります。[続きを読む](older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)

## 新しいブロッキングページ

サンプルブロッキングページ `/usr/share/nginx/html/wallarm_blocked.html` が更新されました。新しいノードバージョンでは、新しいレイアウトが適用され、ロゴとサポートメールのカスタマイズもサポートしています。

新しいレイアウトを持つ新しいブロックページは、デフォルトでは以下のように見えます ：

![Wallarm のブロックページ](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[ブロッキングページの設定に関する詳細 →](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## 統計サービスのパラメーターの変更

Wallarmの統計サービスは、新しい `rate_limit` パラメータを[Wallarmのレート制限](#rate-limits) モジュールのデータとともに返します。新しいパラメータは、拒否されたリクエストと遅延したリクエストをカバーし、モジュールの動作に問題があるかどうかを示します。

[統計サービスの詳細 →](../admin-en/configure-statistics-service.md)

## 新しいNGINXディレクティブ

[レート制限ルール](#rate-limits) が特性を設定するための推奨される方法であるにもかかわらず、新しいNGINXディレクティブを使ってレート制限を設定することもできます：

* [`wallarm_rate_limit`](../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## ノードインスタンスの簡単なグルーピング

これで、 `Deploy` 役割を持つ[**APIトークン**](../user-guides/settings/api-tokens.md) と `WALLARM_LABELS` 変数とその `group` ラベルを使って、ノードインスタンスを簡単にグループ化できます。

例えば：

```bash
docker run -d -e WALLARM_API_TOKEN='<DEPLOY ROLEのAPI TOKEN>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:4.6.2-1
```
... このコマンドは、ノードインスタンスを `<GROUP>` インスタンスグループに配置します（既存の場合、または存在しない場合は作成されます）。

## ノード3.6以前からのアップグレード時

バージョン3.6以前からアップグレードする場合は、[別のリスト](older-versions/what-is-new.md)からすべての変更を確認してください。

## アップグレードが推奨されるWallarmノードは？

* クライアントとマルチテナントのWallarmノードのバージョン4.xは、Wallarmのリリースに最新の状態を保つため、また[インストールされたモジュールが非推奨に](versioning-policy.md#version-support)なるのを防ぐため。
* クライアントとマルチテナントのWallarmノードの[非サポート](versioning-policy.md#version-list)バージョン（3.6以前）。Wallarmノード4.6で利用可能な変更は、ノードの設定を簡略化し、トラフィックのフィルタリングを改善します。ただし、ノード4.6の一部の設定は、古いバージョンのノードと**互換性がありません**。

## アップグレードプロセス

1. [モジュールのアップグレードのための推奨事項](general-recommendations.md)を確認してください。
2. Wallarmノードのデプロイオプションの手順に従って、インストールされたモジュールをアップグレードします：

      * [NGINX, NGINX Plusのモジュール](nginx-modules.md)
      * [NGINXまたはEnvoyのモジュールを持つDockerコンテナ](docker-container.md)
      * [統合されたWallarmモジュールを持つNGINX Ingressコントローラ](ingress-controller.md)
      * [統合されたWallarmモジュールを持つKong Ingressコントローラ](kong-ingress-controller.md)
      * [サイドカープロキシ](sidecar-proxy.md)
      * [クラウドノードイメージ](cloud-image.md)
      * [CDNノード](cdn-node.md)
      * [マルチテナントノード](multi-tenant.md)

----------

[その他のWallarm製品とコンポーネントの更新 →](https://changelog.wallarm.com/)
