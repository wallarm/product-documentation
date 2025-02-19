[img-set-policy-in-gui]:    ../../../images/fast/operations/common/test-policy/overview/tr-gui-set-policy.png
[img-get-policy-id]:        ../../../images/fast/operations/common/test-policy/overview/get-policy-id.png

[doc-pol-tr-relations]:     ../internals.md#fast-test-policy
[doc-tr-creation-gui]:      ../create-testrun.md#creating-a-test-run-via-web-interface
[doc-tr-creation-api]:      ../create-testrun.md#creating-a-test-run-via-api
[doc-tr-copying-gui]:       ../copy-testrun.md#copying-a-test-run-via-web-interface
[doc-tr-copying-api]:       ../copy-testrun.md#copying-a-test-run-via-an-api

[doc-ci-mode]:              ../../poc/integration-overview-ci-mode.md
[doc-tr-pid-envvar]:        ../../poc/ci-mode-testing.md#environment-variables-in-testing-mode

[link-pol-list-eu]:         https://my.wallarm.com/testing/policies/     
[link-pol-list-us]:         https://us1.my.wallarm.com/testing/policies/


# テストポリシーの利用

テストポリシーはセキュリティテストと[関連][doc-pol-tr-relations]しており、テスト実行を作成する際に各テストポリシーがFASTノードの動作を定義および指定します。

テストポリシーの指定方法は以下の通りです:

* インターフェースを使用する場合、テストが[作成][doc-tr-creation-gui]または[コピー][doc-tr-copying-gui]される際に、**Test policy**のドロップダウンリストからポリシーを選択します:

    ![インターフェース経由でテスト実行作成時にテストポリシーを選択する様子][img-set-policy-in-gui]

* テストポリシーIDを指定します:
    * APIメソッドを使用してテストが[作成][doc-tr-creation-api]または[コピー][doc-tr-copying-api]される場合は、APIリクエスト内に指定します
    * テストを[FAST node][doc-ci-mode]で管理する場合は、[`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar]環境変数に指定します
        
    Wallarmアカウントのポリシー一覧にて、[EU cloud][link-pol-list-eu]または[US cloud][link-pol-list-us]のテストポリシーIDを確認できます。

    ![ポリシーIDの確認][img-get-policy-id]

!!! info "デフォルトテストポリシー"
    FASTは自動で**Default Policy**を作成および適用します。このポリシーは、最も一般的に使用されるリクエストポイントをチェックすることでアプリケーションの一般的な脆弱性をテストします。

    なお、デフォルトテストポリシーの設定は変更できません。