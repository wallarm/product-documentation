# APIポリシー適用の設定

この記事では、アップロードした[API仕様に基づいたAPI保護](overview.md)を有効にし、設定する方法について説明します。

## ステップ1: 仕様のアップロード

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/)または[EU Cloud](https://my.wallarm.com/api-specifications/)の**API仕様**セクションで、**仕様をアップロード**をクリックします。
1. 仕様アップロードパラメータを設定し、アップロードを開始します。

    ![仕様のアップロード](../images/api-specification-enforcement/specificaton-upload.png)

仕様のファイルが正常にアップロードされるまで、APIポリシーの設定を開始することはできません。

## ステップ2: ポリシー違反のアクションを設定

1. **APIポリシー適用**タブをクリックします。

    !!! info "ローグAPI検出"
        * ポリシー適用以外にも、[API Discovery](../api-discovery/overview.md)モジュールが仕様を使用して[ローグAPIの検出](../api-discovery/rogue-api.md)を行う場合があります。API Discoveryが有効になっている場合は、このタブが表示されます。
        * ポリシー適用に先立ち、仕様を使用してAPI Discoveryでローグ（シャドウ、ゾンビ、オーファン）APIを検索することを推奨します。これにより、ご自身の仕様が実際のクライアントリクエストとどの程度異なるかを理解し、ポリシー適用後に関連リクエストがブロックされる可能性が最も高い差分を把握することができます。

1. **仕様をAPIポリシー適用に使用**を選択します。
1. ポリシー違反アクションをアクティブにしたいホストまたはエンドポイントを指定します。

    * アップロードした仕様を適用する必要のあるエンドポイントを誤って指定すると、多くの[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)につながる場合があります。
    * 同じホストに対して異なるエンドポイント（例：`domain.com/v1/api/users/` と `domain.com/v1/api/orders/`）に適用される複数の仕様がある場合、仕様を適用するエンドポイントを**必ず**指定する必要があります。
    * ホストに仕様を追加し、その後でこのホストの個々のエンドポイントに別の仕様を追加すると、これらのエンドポイントに両方の仕様が適用されます。
    * 値は、[URIコンストラクタ](../user-guides/rules/rules.md#uri-constructor)または[詳細編集フォーム](../user-guides/rules/rules.md#advanced-edit-form)を介して設定することができます。

1. リクエストが仕様に違反した場合のシステムの反応を設定します。

    ![仕様 - APIポリシー適用に使用](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    可能な違反の詳細：

    --8<-- "../include-ja/api-policies-enforcement/api-policies-violations.md"

    仕様をAPIポリシー適用に初めて使用する場合は、仕様が必要なエンドポイントに適用され、実際のエラーを検出することを確認するために、反応として`モニター`を設定することを推奨します。

**無効化**

APIの一部をAPIポリシー適用機能から除外する必要がある場合、以下の方法で行うことができます：

* [パッケージデプロイメント](../installation/supported-deployment-options.md#packages)の場合（[オールインワンインストーラ](../installation/nginx/all-in-one.md)を介したものを含む）、APIポリシー適用が使用されている任意の`server`セクションにて、[`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINXディレクティブを`off`に設定。
* NGINXベースのDockerイメージの場合は、`WALLARM_APIFW_ENABLE`[環境変数](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)を`false`に設定。
* NGINX Ingress Controllerの場合は、[`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)値グループで`enable`を`false`に設定。