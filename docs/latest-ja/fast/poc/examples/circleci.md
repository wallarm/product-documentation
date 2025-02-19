```markdown
[img-demo-app]:                 ../../../images/fast/poc/common/examples/demo-app.png
[img-testing-flow]:             ../../../images/fast/poc/en/examples/testing-flow.png
[img-testing-flow-fast]:        ../../../images/fast/poc/en/examples/testing-flow-fast.png
[img-services-relations]:       ../../../images/fast/poc/common/examples/api-services-relations.png
[img-test-traffic-flow]:        ../../../images/fast/poc/en/examples/test-traffic-flow.png

[img-cci-pass-token]:           ../../../images/fast/poc/common/examples/circleci/pass-token.png
[img-cci-pass-results]:         ../../../images/fast/poc/common/examples/circleci/pass-results.png
[img-cci-workflow]:             ../../../images/fast/poc/en/examples/circleci/api-workflow.png

[img-cci-demo-pass-token]:      ../../../images/fast/poc/common/examples/circleci/demo-pass-token.png
[img-cci-demo-rspec-tests]:     ../../../images/fast/poc/common/examples/circleci/api-demo-rspec-tests.png
[img-cci-demo-testrun]:         ../../../images/fast/poc/common/examples/circleci/demo-testrun.png
[img-cci-demo-tests-failed]:    ../../../images/fast/poc/common/examples/circleci/demo-tests-failed.png
[img-cci-demo-vuln-details]:    ../../../images/fast/poc/common/examples/circleci/demo-vuln-details.png

[doc-env-variables]:            ../../operations/env-variables.md
[doc-testrun-steps]:            ../../operations/internals.md#test-run-execution-flow-baseline-requests-recording-takes-place
[doc-testrun-creation]:         ../node-deployment.md#creating-a-test-run
[doc-get-token]:                ../../operations/create-node.md
[doc-stopping-recording]:       ../stopping-recording.md
[doc-waiting-for-tests]:        ../waiting-for-tests.md
[doc-node-ready-for-recording]: ../node-deployment.md#creating-a-test-run

[link-api-recoding-mode]:       ../integration-overview-api.md#deployment-via-the-api-when-baseline-requests-recording-takes-place

[link-example-project]:         https://github.com/wallarm/fast-example-api-circleci-rails-integration
[link-rspec]:                   https://rspec.info/
[link-capybara]:                https://github.com/teamcapybara/capybara
[link-selenium]:                https://www.seleniumhq.org/
[link-docker-compose-build]:    https://docs.docker.com/compose/reference/build/
[link-circleci]:                https://circleci.com/

[link-wl-portal]:               https://us1.my.wallarm.com
[link-wl-portal-testrun-tab]:   https://us1.my.wallarm.com/testing/?status=running

[anchor-project-description]:           #how-the-sample-application-works
[anchor-cci-integration-description]:   #how-fast-integrates-with-rspec-and-circleci
[anchor-cci-integration-demo]:          #demo-of-the-fast-integration

# CI/CDへのFAST統合の例

!!! info "章の規約"
    本章では例示として `token_Qwe12345` というトークン値が使用されます。

WallarmのGitHub上には[fast-example-api-circleci-rails-integration][link-example-project]のサンプルプロジェクトが用意されています。本プロジェクトは、既存のCI/CDプロセスへのFAST統合の方法を実演することを目的としています。本例は、[“Deployment via the API when Baseline Requests Recording Takes Place”][link-api-recoding-mode] シナリオに従っています。

本ドキュメントには、以下の情報が含まれます：
1.  [サンプルアプリケーションの動作の説明][anchor-project-description]
2.  [FAST統合についての詳細なステップバイステップの説明][anchor-cci-integration-description]
3.  [実際にFAST統合が動作するデモ][anchor-cci-integration-demo]

## サンプルアプリケーションの動作の仕組み

サンプルアプリケーションはブログに投稿を公開する機能と、ブログ投稿を管理する機能を備えたウェブアプリケーションです。

![サンプルアプリケーション][img-demo-app]

このアプリケーションはRuby on Railsで作成され、Dockerコンテナとして提供されます。

また、アプリケーションのために[RSpec][link-rspec]の統合テストが作成されています。RSpecは[Capybara][link-capybara]を用いてウェブアプリケーションと対話し、Capybaraは[Selenium][link-selenium]を使用してアプリケーションへHTTPリクエストを送信します：

![テストフロー][img-testing-flow]

RSpecは以下のシナリオをテストするためにいくつかの統合テストを実行します：
* 投稿一覧ページへの移動
* 新規投稿の作成
* 既存投稿の更新
* 既存投稿の削除

CapybaraとSeleniumは、これらのテストをアプリケーションへの一連のHTTPリクエストに変換するのに役立ちます。

!!! info "テストの場所"
    上記の統合テストは `spec/features/posts_spec.rb` ファイルに記述されています。

## FASTがRSpecおよびCircleCIと統合される方法

ここではサンプルプロジェクトにおけるFASTのRSpecおよびCircleCIとの統合の概要を示します。

RSpecはテスト実行前後にフックをサポートしています：

```
config.before :context, type: :feature do
    # RSpecテスト実行前に実行する処理
  end
    # RSpecテスト実行
  config.after :context, type: :feature do
    # RSpecテスト実行後に実行する処理
  end
```

これは、FASTセキュリティテストを含む手順で、RSpecがアプリケーションのテストを行う際の処理を拡張できることを意味します。

`HTTP_PROXY`環境変数を使用して、Seleniumサーバーをプロキシサーバーに向けることができます。そのため、アプリケーションへのHTTPリクエストはプロキシされます。プロキシ機能の利用により、統合テストで発行されたリクエストを既存のテストフローに最小限の介入でFASTノードを通して渡すことが可能です：

![FASTを組み込んだテストフロー][img-testing-flow-fast]

上述の事実をすべて踏まえ、CircleCIジョブは構築されます。このジョブは以下のステップで構成されます（`.circleci/config.yml`ファイルを参照ください）：

1.  必要な準備：
    
    [トークンを取得][doc-get-token]し、その値を`TOKEN`環境変数を通じてCircleCIプロジェクトに渡す必要があります。
    新しいCIジョブが設定されると、変数の値はジョブが実行されるDockerコンテナに渡されます。
    
    ![CircleCIにトークンを渡す][img-cci-pass-token]
    
2.  サービスの構築
    
    この段階では、複数のサービスのためにいくつかのDockerコンテナを構築します。コンテナは共通のDockerネットワークに配置されるため、IPアドレスまたはコンテナ名を用いて相互に通信可能です。
    
    以下のサービスが構築されます（`docker-compose.yaml`ファイルを参照ください）：
    
    * `app-test`: 対象アプリケーションおよびテストツール用のサービスです。
        
        サービスのDockerイメージは以下のコンポーネントから構成されます：
        
        * 対象アプリケーション（デプロイ後、`app-test:3000`でHTTPアクセス可能です）。
        
        * Capybaraを組み合わせたRSpecテストツール；このツールにはFASTセキュリティテストを実行するために必要なすべての機能が含まれています。
        
        * Capybara：Seleniumサーバー`selenium:4444`を使用して対象アプリケーション`app-test:3000`へHTTPリクエストを送信するように設定されています（`spec/support/capybara_settings.rb`ファイルを参照ください）。
        
        トークンは`WALLARM_API_TOKEN=$TOKEN`環境変数によってサービスのコンテナに渡されます。このトークンは、`config.before`および`config.after`セクション（`spec/support/fast-helper.rb`ファイルを参照ください）に記述された関数によりテストラン操作に使用されます。
    
    * `fast`: FASTノード用のサービスです。
        
        デプロイ後、ノードは`fast:8080`でHTTPアクセス可能です。
        
        トークンは`WALLARM_API_TOKEN=$TOKEN`環境変数によってサービスのコンテナに渡されます。このトークンはFASTが正しく動作するために必要です。
        
        !!! info "ベースラインリクエストに関する注意"
            本例では`ALLOWED_HOSTS` [環境変数][doc-env-variables]は使用されておらず、したがってすべての受信リクエストをベースラインリクエストとしてFASTノードが認識します。
    
    * `selenium`: Seleniumサーバー用のサービスです。`app-test`コンテナ内のCapybaraはこのサーバーを利用して動作します。
        
        `HTTP_PROXY=http://fast:8080`環境変数がサービスのコンテナに渡され、FASTノードを通じたリクエストのプロキシが有効になります。
        
        デプロイ後、サービスは`selenium:4444`でHTTPアクセス可能です。
        
    すべてのサービスは以下のような関係性を形成します：
    
    ![サービス間の関係性][img-services-relations]
    
3.  上記の関係性により、サービスは以下の厳格な順序でデプロイする必要があります：
    1.  `fast`
    2.  `selenium`
    3.  `app-test`
    
    `docker-compose up -d fast selenium`コマンドを発行することで、`fast`および`selenium`サービスは順次デプロイされます。
    
4.  SeleniumサーバーとFASTノードが正常にデプロイされたら、`app-test`サービスのデプロイおよびRSpecテストの実行を行います。
    
    そのために、以下のコマンドを実行します：
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`
    
    テストおよびHTTPトラフィックのフローは次の画像に示されています：
    
    ![テストおよびHTTPトラフィックのフロー][img-test-traffic-flow]
    
    [シナリオ][link-api-recoding-mode]に従い、RSpecテストにはFASTセキュリティテストを実行するために必要なすべてのステップが含まれています（`spec/support/fast_hooks.rb`ファイルを参照ください）：
    
    1.  RSpecテスト実行前にテストランが[作成されます][doc-testrun-creation]。
        
        次に、FASTノードがベースラインリクエストを記録する準備ができているか確認するためにAPIコールが[実行されます][doc-node-ready-for-recording]。ノードが準備完了になるまで、既存のテスト実行プロセスは開始されません。
        
        !!! info "使用中のテストポリシー"
            本例ではデフォルトのテストポリシーが使用されます。
        
    2.  RSpecテストが実行されます。
    3.  RSpecテスト完了後、以下の処理が行われます：
        1.  ベースラインリクエスト記録プロセスが[停止されます][doc-stopping-recording]；
        2.  テストランの状態が定期的に[監視されます][doc-waiting-for-tests]：
            * FASTセキュリティテストが正常に完了した場合（テストランの状態が `state: passed` 、）exitコード`0`がRSpecに返されます。
            * FASTセキュリティテストが異常終了した場合（いくつかの脆弱性が検出され、テストランの状態が `state: failed` 、）exitコード`1`がRSpecに返されます。
    
5.  テスト結果の取得：
    
    RSpecプロセスのexitコードは`docker-compose run`プロセスに渡され、その後CircleCIに渡されます。     
    
    ![CircleCIにおけるジョブ結果][img-cci-pass-results]

記述されたCircleCIジョブは、先に示した[シナリオ][link-api-recoding-mode]のステップに厳密に従っています：

![詳細なCircleCIジョブ][img-cci-workflow]

## FAST統合のデモ

1.  Wallarmクラウドで[FASTノードを作成][doc-get-token]し、表示されたトークンをコピーします。
2.  [サンプルプロジェクトファイル][link-example-project]を自分のGitHubリポジトリにコピーします。
3.  [CircleCI][link-circleci]にGitHubリポジトリを追加します（CircleCIで「Follow Project」ボタンを押してください）。これにより、リポジトリの内容が変更されるたびにCIジョブが起動されます。CircleCIの用語では、リポジトリは「プロジェクト」と呼ばれます。
4.  CircleCIプロジェクトに`TOKEN`環境変数を追加します。プロジェクトの設定から追加可能です。この変数の値としてFASTトークンを渡します：
    
    ![プロジェクトにトークンを渡す][img-cci-demo-pass-token]
    
5.  何かしらをリポジトリにプッシュしてCIジョブを開始します。RSpecの統合テストが成功裏に終了することを確認してください（ジョブのコンソール出力を参照ください）：
    
    ![RSpecテストがパスしました][img-cci-demo-rspec-tests]
    
6.  テストランが実行中であることを確認します。
    
    WallarmポータルにWallarmアカウント情報でログインし、[“Testruns” tab][link-wl-portal-testrun-tab]に移動して、リアルタイムでアプリケーションの脆弱性テストの進行状況を確認できます：
    
    ![テストラン実行][img-cci-demo-testrun]
    
7.  テストプロセスが終了した後、CIジョブのステータスが「Failed」と表示されることを確認できます：
    
    ![CIジョブの完了][img-cci-demo-tests-failed]
    
    Wallarmデモアプリケーションをテストしているため、CIジョブの失敗はFASTがアプリケーションで検出した脆弱性を示します（ビルドログに「FAST tests have failed」というメッセージが表示されます）。この失敗は、ビルドに関する技術的な問題によるものではありません。
    
    !!! info "エラーメッセージ"
        「FAST tests have failed」というエラーメッセージは、`spec/support/fast_helper.rb`ファイルに記述された`wait_test_run_finish`メソッドにより出力され、exitコード`1`で終了する前に生成されます。
    
8.  テスト実行中、CircleCIのコンソールには検出された脆弱性の情報は表示されません。
    
    Wallarmポータル上で脆弱性の詳細を確認できます。そのためには、テストランのリンクに移動してください。このリンクはCircleCIコンソールのFAST情報メッセージの一部として表示されます。
    
    このリンクは次のようになります：
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`
    
    例えば、完了したテストランを確認することで、サンプルアプリケーションにいくつかのXSS脆弱性が検出されたことが分かります：
    
     ![脆弱性の詳細情報][img-cci-demo-vuln-details]

結論として、統合テストがエラーなくパスしても、FASTが既存のCI/CDプロセスに強力に統合できるだけでなく、アプリケーション内の脆弱性を発見する能力があることが実証されました。
```