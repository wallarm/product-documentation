[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API仕様施行設定 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

本記事では、[アップロードしたAPI仕様](overview.md)に基づいてAPI保護を有効化し、構成する方法について解説します。

## ステップ1：仕様のアップロード

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/)または[EU Cloud](https://my.wallarm.com/api-specifications/)の**API Specifications**セクションで、**Upload specification**をクリックします。
1. 仕様のアップロードパラメータを設定して、アップロードを開始します。

    ![仕様のアップロード](../images/api-specification-enforcement/specificaton-upload.png)

仕様ファイルが正常にアップロードされるまで、API仕様施行の構成を開始できないのでご注意ください。

## ステップ2：ポリシー違反時のアクションを設定します

1. **API specification enforcement**タブをクリックします。

    !!! info "不正API検出"
        * セキュリティポリシーの適用に加えて、仕様は[API Discovery](../api-discovery/overview.md)モジュールで[不正API検出](../api-discovery/rogue-api.md)に利用できます。API Discoveryが有効化されている場合、このタブが表示されます。
        * 仕様をセキュリティポリシーの適用に使用する前に、API Discoveryを利用してローグ（シャドウ、ゾンビ、孤立）APIの検索に使用することを推奨します。この方法により、お客様の仕様が実際のリクエストとどの程度異なるかを把握でき、これらの差異がセキュリティポリシー適用後に関連リクエストのブロックを引き起こす可能性が高いことが分かります。

1. **Use for API specification enforcement**を選択します。
1. ポリシー違反アクションを有効にするホストまたはエンドポイントを指定します。

    * アップロードされた仕様を適用するエンドポイントを誤って指定すると、多くの[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)イベントが発生します。
    * 同じホストに対して複数の仕様が存在する場合でも、エンドポイントが異なる場合（例：`domain.com/v1/api/users/`および`domain.com/v1/api/orders/`）、仕様を適用するエンドポイントを必ず指定する必要があります。
    * ホスト全体に仕様を追加した後、さらにそのホストの個別エンドポイントに仕様を追加した場合、両方の仕様がこれらのエンドポイントに適用されます。
    * 値は[URI constructor](../user-guides/rules/rules.md#uri-constructor)または[advanced edit form](../user-guides/rules/rules.md#advanced-edit-form)を使用して設定可能です。

1. リクエストが仕様に違反した場合のシステムの動作を設定します。

    ![仕様 - セキュリティポリシー適用に使用](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    発生しうる違反内容の詳細:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

初めて仕様をセキュリティポリシーの設定に使用する場合、仕様が必要なエンドポイントに適用され、実際のエラーを検知できることを確認するために、反応として`Monitor`を設定することを推奨します.

## 無効化

API Specification Enforcementは、アップロードされた仕様または**Use for API specification enforcement**オプションが選択された複数の仕様に基づいて動作します。このオプションのチェックを外す、または仕様を削除すると、その仕様に基づく保護が停止するためご留意ください.

また、APIの一部に対してのみAPI Specification Enforcement機能を無効化する必要がある場合、以下の方法で実施できます:

* [all-in-one installer](../installation/nginx/all-in-one.md)展開の場合、`server`セクションでNGINXディレクティブ[`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw)を`off`に設定することにより無効化できます.
* NGINXベースのDockerイメージの場合、[environment variable](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APIFW_ENABLE`を`false`に設定することにより無効化できます.
* NGINX Ingress Controllerの場合、[`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)の値グループにおいて`enable`を`false`に設定することにより無効化できます.