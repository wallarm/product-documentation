# 分離環境のためのフィルタノード設定に関する推奨事項

すでに[分離環境におけるWallarmフィルタノードの動作方法](how-wallarm-in-separated-environments-works.md)について学んでいます。この通りにノードが動作するため、分離環境におけるノードの設定に関する推奨事項を本稿でご確認ください。

## 初期のWallarm保護展開プロセス

環境向けのWallarm保護の初回導入を実施する場合は、以下の方法を推奨します（必要に応じて調整してください）:

1. [こちら](../../../installation/supported-deployment-options.md)で利用可能なWallarmノードの展開オプションについて確認してください。
2. 必要に応じて環境向けのフィルタノード設定を個別に管理するための利用可能なオプションについて確認してください。この情報は[こちら](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features)でご確認いただけます。
3. 非本番環境にWallarmフィルタノードをデプロイし、フィルトレーションモードを`monitoring`に設定してください。
4. Wallarmソリューションの運用、スケール、および監視方法について学び、新しいネットワークコンポーネントの安定性を確認してください。
5. 本番環境にWallarmフィルタノードをデプロイし、フィルトレーションモードを`monitoring`に設定してください。
6. 新しいWallarmコンポーネントのために、適切な構成管理および監視プロセスを実施してください。
7. Wallarmクラウド‑ベースのバックエンドがアプリケーションの動作を把握できるよう、テスト環境および本番環境を含むすべての環境で、フィルタノードを経由してトラフィックを7～14日間流し続けてください。
8. すべての非本番環境で`blocking`フィルトレーションモードを有効にし、自動または手動テストを用いて保護対象のアプリケーションが期待どおりに動作していることを確認してください。
9. 本番環境で`blocking`フィルトレーションモードを有効にし、利用可能な方法でアプリケーションが期待どおりに動作していることを確認してください。

!!! info
    フィルトレーションモードの設定については、[こちらの手順](../../configure-wallarm-mode.md)をご参照ください。

## 新しいWallarmノード変更の段階的導入

時折、既存のWallarmインフラストラクチャに変更が必要になる場合があります。組織の変更管理ポリシーに応じ、潜在的にリスクのある変更を非本番環境でテストし、その後本番環境に変更を適用する必要があるかもしれません。

以下の方法が、各Wallarmコンポーネントや機能の設定変更をテストし段階的に実施するために推奨されます:
* [あらゆる形状のWallarmフィルタノードの低レベル設定](#low-level-configuration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Wallarmノードルールの設定](#configuration-of-wallarm-node-rules)

### あらゆる形状のWallarmフィルタノードの低レベル設定

フィルタノードの低レベル設定は、Docker環境変数、提供されたNGINX設定ファイル、Kubernetes Ingressコントローラーのパラメータ等を通じて実施されます。設定方法は[展開オプション](../../../installation/supported-deployment-options.md)に依存します。

低レベル設定は、既存のインフラ資源の変更管理プロセスを用いることで、異なる顧客環境ごとに個別に管理しやすくなります。

### Wallarmノードルールの設定

各ルールレコードは[異なるセット](how-wallarm-in-separated-environments-works.md#resource-identification)のアプリケーションインスタンスIDまたは`HOST`リクエストヘッダーに関連付け可能なため、以下のオプションを推奨します:

* まず、テストまたは開発環境に新しい設定を適用し、機能を確認した上で、本番環境に変更を適用してください。
* `Create regexp-based attack indicator`ルールを`Experimental`モードで使用してください。このモードを利用することで、本番環境に直接ルールをデプロイして、正当なエンドユーザリクエストが誤ってブロックされるリスクを回避できるようになります。

    ![Creating experimental rule](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* `Set filtration mode`ルールを使用し、特定環境およびリクエストに対するWallarmフィルトレーションモードを制御してください。このルールにより、新しいエンドポイントなどの保護対象リソースへWallarm保護を段階的に展開する際の柔軟性が向上します。デフォルトでは、[`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode)の値が、[`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override)の設定に依存して使用されます。

    ![Creating a rule to overwrite the filtration mode](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)