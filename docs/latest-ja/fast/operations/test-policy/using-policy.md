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


# テストポリシーの使用

テストポリシーはセキュリティテストと[関連付けられています][doc-pol-tr-relations]。テストイテレーションの作成時に、各テストポリシーがFAST nodeの動作を定義・指定します。

テストポリシーは次の方法で指定できます。

* インターフェースを使用する場合、テストを[作成][doc-tr-creation-gui]または[コピー][doc-tr-copying-gui]する際に、**Test policy**ドロップダウンリストからポリシーを選択します:

    ![インターフェースでのテストラン作成時のテストポリシー選択][img-set-policy-in-gui]

* テストポリシーIDを指定します:
    * APIメソッドでテストを[作成][doc-tr-creation-api]または[コピー][doc-tr-copying-api]する場合は、APIリクエスト内で指定します
    * [FAST node][doc-ci-mode]でテストを管理する場合は、[`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar]環境変数で指定します
       
    テストポリシーIDは、Wallarmアカウントのポリシー一覧（[EUクラウド][link-pol-list-eu]または[USクラウド][link-pol-list-us]）で確認できます。

    ![ポリシーIDの取得][img-get-policy-id]

!!! info "デフォルトのテストポリシー"
    FASTは**Default Policy**を自動的に作成して適用します。このポリシーは、最も一般的に使用されるリクエストポイントを確認することで、典型的な脆弱性についてアプリケーションをテストします。

    なお、デフォルトのテストポリシーの設定は変更できません。