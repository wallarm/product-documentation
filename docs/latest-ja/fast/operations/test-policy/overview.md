[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FASTテストポリシー: 概要

FASTは、アプリケーションの[脆弱性][gl-vuln]をテストする際のFASTノードの動作を設定できるテストポリシーを使用します。本セクションのドキュメントにはテストポリシーの管理手順が記載されています。

!!! info "用語"
    本セクションでは「FAST test policy」という用語を「policy」と略記することがあります。

## テストポリシーの原則

FASTはリクエストの要素を[ポイント][gl-point]として表現し、処理が許可されたポイントを1つ以上含むリクエストのみを処理します。このようなポイントの一覧はポリシーで定義します。リクエストに許可されたポイントが含まれていない場合、そのリクエストは破棄され、それを基にテストリクエストは作成されません。

ポリシーは以下の事項を規定します:

* テストの実施方法
    
    テスト中、FASTは以下の方法のうち1つ以上を用います:
    
    * 内蔵のFAST拡張機能（*detects*とも呼ばれます）を使用した脆弱性の検出
    * カスタム拡張機能を使用した脆弱性の検出
    * FASTのファズテストを用いた[アノマリー][gl-anomaly]の検出

* アプリケーションのテスト中にFASTノードが処理するベースラインリクエストの要素

    処理を許可するポイントは、お使いのWallarmアカウントのpolicy editorにある**Insertion points** > **Where in the request to include**セクションで設定します。Insertion pointsの詳細は[こちら][doc-insertion-points]をご覧ください。

* アプリケーションのテスト中にFASTノードが処理しないベースラインリクエストの要素

    処理を許可しないポイントは、お使いのWallarmアカウントのテストポリシー設定内の**Insertion points** > **Where in the request to exclude**セクションで設定します。Insertion pointsの詳細は[こちら][doc-insertion-points]で参照できます。

    処理を許可しないポイントの設定は、**Where in the request to include**セクションで多様なポイントを許可しており、個別の要素の処理を除外する必要がある場合に役立ちます。たとえば、すべてのGETパラメータ（`GET_.*`）の処理を許可していて、`uuid`パラメータの処理のみを除外したい場合は、**Where in the request to exclude**セクションに`GET_uid_value`という式を追加します。

!!! warning "ポリシーのスコープ"
    ポイントを明示的に除外した場合、FASTノードはポリシーで許可されたポイントのみを処理します。
    
    それ以外のポイントの処理は実施されません。

??? info "ポリシー例"
    ![ポリシー例](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    上の画像は、FASTノードが脆弱性を検出する際に使用するポリシーを示しています。このポリシーでは、ベースラインリクエスト内のすべてのGETパラメータを処理できますが、常に変更せずに対象アプリケーションへ渡されるGETパラメータ`token`は除外されています。

    さらに、このポリシーでは、fuzzerが非アクティブな間、内蔵のFAST拡張機能およびカスタム拡張機能を使用できます。

    したがって、detectsおよび拡張機能を用いた脆弱性テストは、ベースラインリクエスト**A**（`/app.php?uid=1234`）に対してのみ実行されます
    。

    一方、ベースラインリクエスト**B**（`/app.php?token=qwe1234`）には処理が許可されたGETパラメータが含まれていないため、脆弱性テストは実行されません。代わりに、除外されたパラメータ`token`が含まれています。