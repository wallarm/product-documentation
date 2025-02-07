```markdown
[doc-insertion-points]:     insertion-points.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability
[gl-point]:                 ../../terms-glossary.md#point
[gl-anomaly]:               ../../terms-glossary.md#anomaly

# FASTテストポリシー: 概観

FASTは[vulnerabilities][gl-vuln]のテスト時にFASTノードの挙動を設定するテストポリシーを利用します。本セクションにはテストポリシーの管理に関する手順が記載されています。

!!! info "用語"
    『FASTテストポリシー』という用語は、本ドキュメント内において「policy」と略すことができます。

## テストポリシーの原則

FASTはリクエスト要素を[points][gl-point]として表し、処理が許可された1つ以上のポイントを含むリクエストのみを対象として動作します。これらのポイントのリストはポリシーにより定義されます。リクエストが許可されたポイントを含まない場合、そのリクエストは破棄され、これに基づくテストリクエストは生成されません。

このポリシーは以下のポイントを規定します:

* テストの実施方法
    
    テスト時に、FASTは以下に記載される1つ以上の方法に従って動作します:
    
    * 組み込みFAST拡張機能を用いた脆弱性検出（*detects*とも呼ばれる）
    * カスタム拡張機能を用いた脆弱性検出
    * FASTファズテストを用いた[anomaly][gl-anomaly]検出

* アプリケーションテスト時にFASTノードが処理するベースラインリクエストの要素

    処理が許可されるポイントは、Wallarmアカウントのポリシーエディタ内の**Insertion points** > **Where in the request to include**セクションで設定できます。詳細についてはこの[link][doc-insertion-points]をご参照ください。

* アプリケーションテスト時にFASTノードが処理しないベースラインリクエストの要素

    処理が許可されないポイントは、Wallarmアカウントのテストポリシー設定内の**Insertion points** > **Where in the request to exclude**セクションで設定できます。詳細についてはこの[link][doc-insertion-points]をご覧ください。

    **Where in the request to include**セクションに多様なポイントが含まれる場合、特定の要素の処理を除外する必要がある場合に、処理が許可されないポイントを設定できます。たとえば、すべてのGETパラメーターが処理対象（`GET_.*`）であるにもかかわらず`uuid`パラメーターの処理を除外する必要がある場合は、**Where in the request to exclude**セクションに`GET_uid_value`表現を追加してください。

!!! warning "ポリシースコープ"
    ポイントを明示的に除外する場合、FASTノードはポリシーで許可される唯一のポイントとなります。
    
    リクエスト内のその他のポイントは処理されません。

??? info "ポリシー例"
    ![ポリシー例](../../../images/fast/operations/common/test-policy/overview/policy-flow-example.png)

    上記の画像は、FASTノードが脆弱性検出に使用するポリシーを示しています。このポリシーは、対象アプリケーションへそのまま渡される`token`GETパラメーターを除いた、ベースラインリクエスト中のすべてのGETパラメーターの処理を許可します。

    さらに、ポリシーは、fuzzerが非アクティブな状態でも組み込みFAST拡張機能およびカスタム拡張機能の利用を許可します。

    したがって、detectsおよび拡張機能を用いた脆弱性テストは、ベースラインリクエスト**A**（`/app.php?uid=1234`）に対してのみ実施されます。

    一方、ベースラインリクエスト**B**（`/app.php?token=qwe1234`）については、処理が許可されたGETパラメーターを含まないため脆弱性テストが実施されません。代わりに除外された`token`パラメーターが含まれています.
```