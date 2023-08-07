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

テストポリシーはセキュリティテストに[関連付けられ][doc-pol-tr-relations]ています。テストのイテレーションを作成する際、各テストポリシーはFASTノードの振る舞いを定義し指定します。

以下の方法でテストポリシーを指定できます。

* インターフェースを使用し、テストが[作成][doc-tr-creation-gui]または[コピー][doc-tr-copying-gui]された場合、**テストポリシー** ドロップダウンリストからポリシーを選択します。

    ![!インターフェース経由でテスト送信を作成する際のテストポリシーの選択][img-set-policy-in-gui]

* テストポリシーIDを指定します：
    * APIリクエスト内で、テストがAPIメソッド経由で[作成][doc-tr-creation-api]または[コピー][doc-tr-copying-api]された場合
    * [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] 環境変数内で、[FASTノード][doc-ci-mode]でのテスト管理を行っている場合

    テストポリシーIDは、[EUクラウド][link-pol-list-eu]または[USクラウド][link-pol-list-us]のWallarmアカウントのポリシー一覧から見つけることができます。

    ![!ポリシーIDの取得][img-get-policy-id]

!!! info "デフォルトのテストポリシー"
    FASTは自動的に**デフォルトポリシー**を作成し適用します。このポリシーは、最も一般的なリクエストポイントを確認することで、アプリケーションの典型的な脆弱性をテストします。

    デフォルトのテストポリシーの設定は変更することはできないことにご注意ください。