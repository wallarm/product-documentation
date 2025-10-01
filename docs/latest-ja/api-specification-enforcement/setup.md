[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcementのセットアップ <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

この記事では、[アップロード済みのAPI仕様](overview.md)に基づいてAPI保護を有効化および構成する方法を説明します。

## 手順1: 仕様のアップロード

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/)または[EU Cloud](https://my.wallarm.com/api-specifications/)の**API Specifications**セクションで、**Upload specification**をクリックします。
1. 仕様のアップロードパラメータを設定し、アップロードを開始します。

    ![仕様のアップロード](../images/api-specification-enforcement/specificaton-upload.png)

仕様ファイルはAPI仕様の構文に準拠しているかを検証し、無効な場合はアップロードされません。仕様ファイルが正常にアップロードされるまで、API Specification Enforcementの設定は開始できませんのでご注意ください。

アップロード元としてURIを選び、**Regularly update the specification**（毎時）オプションを選択した場合、定期更新時にエラーが発生することがあります。例えば、URIが利用できない、または更新された仕様ファイルがAPI仕様の構文に準拠していないなどです。これらのエラーの通知を受け取るには、設定済みの[**Integrations**](../user-guides/settings/integrations/integrations-intro.md)で**System related**イベントを選択してください。このカテゴリには仕様のアップロードエラーに関する通知が含まれます。

## 手順2: ポリシー違反時のアクションを設定する

1. **API specification enforcement**タブをクリックします。

    !!! info "ローグAPIの検出"
        * セキュリティポリシーの適用に加えて、仕様は[API Discovery](../api-discovery/overview.md)モジュールによる[ローグAPIの検出](../api-discovery/rogue-api.md)にも使用できます。API Discoveryが有効化されている場合、このタブが表示されます。
        * セキュリティポリシーの適用に仕様を使用する前に、API Discoveryを使ってローグ（シャドウ、ゾンビ、オーファン）APIの探索に使用することを推奨します。そうすることで、仕様が実際のクライアントからのリクエストとどの程度乖離しているかを把握できます。これらの相違は、セキュリティポリシー適用後に関連リクエストのブロックを引き起こす可能性が高いです。

1. **Use for API specification enforcement**を選択します。
1. ポリシー違反時のアクションを有効化したい対象のホストまたはエンドポイントを指定します。

    * アップロードした仕様の適用先エンドポイントを誤って指定すると、多数の[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)イベントが発生する点に注意してください。
    * 同一ホストに対し、異なるエンドポイント（例：`domain.com/v1/api/users/`と`domain.com/v1/api/orders/`）に適用される仕様が複数ある場合は、各仕様を適用するエンドポイントを必ず明示してください。
    * ホストに対して仕様を追加し、その後同一ホストの特定エンドポイントに別の仕様を追加した場合、両方の仕様がこれらのエンドポイントに適用されます。
    * この値は[URI constructor](../user-guides/rules/rules.md#uri-constructor)または[advanced edit form](../user-guides/rules/rules.md#advanced-edit-form)から設定できます。

1. リクエストが仕様に違反した場合のシステムの反応を設定します。

    ![仕様 - セキュリティポリシー適用への利用](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    想定される違反の詳細:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    仕様をセキュリティポリシーの設定に初めて使用する際は、必要なエンドポイントに仕様が適用され、実際のエラーを検出できていることを確認するため、反応として`Monitor`を設定することを推奨します。

## 無効化

API Specification Enforcementは、アップロード済みの仕様（または、各仕様で**Use for API specification enforcement**オプションを選択した複数の仕様）に基づいて動作します。特定の仕様でこのオプションの選択を外す、あるいは当該仕様を削除すると、その仕様に基づく保護は停止される点にご留意ください。

また、場合によってはAPIの一部に対してのみAPI Specification Enforcementの機能を無効化する必要があることがあります。次の方法で実施できます。

* [all-in-oneインストーラー](../installation/nginx/all-in-one.md)でのデプロイの場合、API Specification Enforcementを使用している任意の`server`セクションで、NGINXディレクティブ[`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw)を`off`に設定します。
* NGINXベースのDockerイメージの場合、`WALLARM_APIFW_ENABLE`[環境変数](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)を`false`に設定します。
* NGINX Ingress Controllerの場合、[`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)の値グループで`enable`を`false`に設定します。