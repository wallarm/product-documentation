# 別々の環境に対するフィルターノードの設定に関する推奨事項

すでに [別々の環境での Wallarm フィルタリングノードの動作](how-wallarm-in-separated-environments-works.ja.md) を学習しました。ノードが記述されているように動作するように、この記事から別々の環境でのノード設定に関する推奨事項を学習してください。

## Wallarm 保護の初期展開プロセス

環境に対する Wallarm 保護の最初の展開を実施する場合、以下のアプローチをお勧めします(必要に応じて調整していただいてかまいません)。

1. [こちら](../../../installation/supported-deployment-options.ja.md)で利用可能な Wallarm ノードの展開オプションについて学習してください。
2. 必要に応じて、環境に対してフィルタリングノード設定を個別に管理するための利用可能なオプションについて学習してください。この情報は [こちら](how-wallarm-in-separated-environments-works.ja.md#relevant-wallarm-features) で見つけることができます。
3. フィルタリングモードを `monitoring` に設定した状態で、非本番環境に Wallarm フィルタリングノードを展開します。
4. Wallarm ソリューションの操作、スケーリング、モニタリング方法について学習し、新しいネットワークコンポーネントの安定性を確認します。
5. フィルタリングモードを `monitoring` に設定した状態で、本番環境に Wallarm フィルタリングノードを展開します。
6. 新しい Wallarm コンポーネントの適切な設定管理と監視プロセスを実装します。
7. 7〜14日間、開発および本番を含むすべての環境で、フィルタリングノード経由でトラフィックを流し続けます。これにより、Wallarm クラウドベースのバックエンドがアプリケーションに関する情報を学習するための時間が与えられます。
8. すべての非本番環境で `blocking` フィルタリングモードを有効にし、自動テストまたは手動テストを使用して、保護されたアプリケーションが予期される動作をしていることを確認します。
9. 本番環境で `blocking` フィルタリングモードを有効にします。利用可能な方法を使用して、アプリケーションが予期される動作をしていることを確認してください。

!!! info
    フィルタリングモードを設定するには、これらの[指示](../../configure-wallarm-mode.ja.md)を使用してください。

## 新しい Wallarm ノードの変更を段階的に展開する

時々、既存の Wallarm インフラストラクチャに変更が必要になることがあります。組織の変更管理ポリシーによっては、非本番環境で潜在的にリスクのあるすべての変更をテストし、本番環境で変更を適用することが求められる場合があります。

Wallarm のさまざまなコンポーネントと機能の設定をテストし、段階的に変更するために以下のアプローチが推奨されます。
* [すべての形態で Wallarm フィルタリングノードの低レベル設定](#low-level-onfiguration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Wallarm ノードのルールの設定](#configuration-of-wallarm-node-rules)

### すべての形態で Wallarm フィルタリングノードの低レベル設定

フィルタリングノードの低レベル設定は、Docker 環境変数、提供される NGINX 設定ファイル、Kubernetes Ingress コントローラーパラメータなどを介して行われます。設定方法は[デプロイメントオプション](../../../installation/supported-deployment-options.ja.md)によって異なります。

低レベル設定は、インフラストラクチャリソースの既存の変更管理プロセスを使用して、異なる顧客環境に対して個別に管理することが容易にできます。

### Wallarm ノードのルール設定

各ルールレコードは、[異なるセット](how-wallarm-in-separated-environments-works.ja.md#resource-identification)のアプリケーションインスタンスIDまたは `HOST` リクエストヘッダに関連付けることができるため、以下のオプションが推奨されます。

* まず、新しい設定をテストまたは開発環境に適用し、機能を検証し、次に本番環境に変更を適用します。
* `正規表現ベースの攻撃指標を作成`ルールを `実験モード` で使用します。このモードでは、ルールを誤って正当なエンドユーザリクエストをブロックすることなく、直接本番環境に展開することができます。

    ![!実験的なルールの作成](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* `フィルタリングモードの設定` ルールを使用して、特定の環境とリクエストに対する Wallarm フィルタリングモードを制御します。このルールは、Wallarm 保護を新しいエンドポイントや他のリソースに段階的に展開する方法に追加の柔軟性を提供します。デフォルトでは、[`wallarm_mode_allow_override`](../../configure-parameters-en.ja.md#wallarm_mode_allow_override) 設定に応じて [`wallarm_mode`](../../configure-parameters-en.ja.md#wallarm_mode) 値が使用されます。

    ![!フィルタリングモードを上書きするルールの作成](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)