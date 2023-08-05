# 分離された環境でのフィルターノードの設定に関する推奨事項

既に[分離した環境でのWallarmフィルタリングノードの動作](how-wallarm-in-separated-environments-works.md)について学習しています。ノードが記述した通りに動作するように、本記事から分離した環境でのノード設定の推奨事項を学びましょう。

## Wallarm保護の初期展開プロセス

環境に対してWallarm保護を初めて展開する場合、以下のアプローチを用いることを推奨します（必要に応じて調整してください）：

1. 利用可能な Wallarm ノードの展開オプションについて[ここ](../../../installation/supported-deployment-options.md)で学びましょう。
2. 必要に応じて、手元の環境に対してフィルタリングノード設定を個別に管理するための利用可能なオプションについて学びます。この情報は[ここ](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features)で見つけることができます。
3. フィルタモードを`モニタリング`に設定した状態で、お客様の非プロダクション環境に Wallarm フィルタリングノードを展開します。
4.  Wallarm 解決策の操作方法、スケーリング、モニタリング方法を学び、新たなネットワークコンポーネントの安定性を確認します。
5. フィルタモードを`モニタリング`に設定した状態で、お客様のプロダクション環境に Wallarm フィルタリングノードを展開します。
6. 新しい Wallarm コンポーネントの適切な設定管理と監視プロセスを実装します。
7. テスト環境やプロダクション環境を含む全ての環境でフィルタリングノードを通じてトラフィックを流し続けます。これにより、Wallarmクラウドベースのバックエンドがアプリケーションについて学習するのに7〜14日の時間を与えます。
8. 非プロダクション環境すべてで`ブロッキング`フィルタモードを有効にし、自動化されたテストや手動テストを用いて、保護されたアプリケーションが期待通りに動作していることを確認します。
9. 本番環境で`ブロッキング`フィルターモードを有効にします。 利用可能な方法を使用して、アプリケーションが期待通りに動作していることを確認します。

!!! info
    フィルタモードを設定するために、[こちらの手順](../../configure-wallarm-mode.md)を使用してください。

## 新しいWallarmノード変更の段階的な展開

時折、既存のWallarmインフラストラクチャで変更が必要な場合があります。組織の変更管理ポリシーによっては、潜在的にリスクのある変更をすべて非プロダクション環境でテストし、その後プロダクション環境で変更を適用することが求められる場合もあります。

以下のアプローチが、さまざまなWallarmコンポーネントや特性の設定をテストし、段階的に変更することを推奨します：
* [すべてのフォームファクタでのWallarmフィルタリングノードの低レベル設定](#low-level-configuration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Wallarmノードルールの設定](#configuration-of-wallarm-node-rules)

### 全形態でのWallarmフィルタリングノードの低レベル設定

フィルタリングノードの低レベル設定は、Docker環境変数、提供されたNGINX設定ファイル、KubernetesのIngressコントローラパラメータなどを通じて行われます。設定の方法は[展開オプション](../../../installation/supported-deployment-options.md)により異なります。

低レベルの設定は、インフラストラクチャリソースの既存の変更管理プロセスを使用して、異なる顧客環境ごとに簡単に個別に管理することができます。

### Wallarmノードルールの設定

各ルールレコードは、[異なるセット](how-wallarm-in-separated-environments-works.md#resource-identification)のアプリケーションインスタンスIDまたは`HOST`リクエストヘッダーに関連付けることができるため、以下のオプションが推奨されます：

* 新しい設定をまずテスト環境または開発環境に適用し、機能を確認した後、プロダクション環境に対する変更を適用します。
* `Create regexp-based attack indicator`(正規表現に基づいた攻撃指標を作成)ルールを`Experimental`(実験的)モードで使用します。 このモードでは、ルールを間違って有効なエンドユーザーリクエストをブロックするリスクなしに、直接プロダクション環境にデプロイできます。

    ![!Creating experimental rule](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* `Set filtration mode`(フィルターモードの設定)ルールを使用して、特定の環境やリクエストに対するWallarmのフィルタリングモードを制御します。 このルールは、Wallarm保護を段階的に展開し、新たなエンドポイントや他のリソースを異なる環境で保護する方法に追加の柔軟性を提供します。 デフォルトでは、[`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode)値は、[`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override)設定に応じて使用されます。

    ![!Creating a rule to overwrite the filtration mode](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)