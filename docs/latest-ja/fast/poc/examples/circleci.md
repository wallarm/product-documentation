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

#   FASTのCI/CDへの統合例

!!! info "本章の規約"
    本章を通して、次のトークン値を例として使用します: `token_Qwe12345`。

WallarmのGitHubにはサンプルプロジェクト[fast-example-api-circleci-rails-integration][link-example-project]が用意されています。目的は、既存のCI/CDプロセスにFASTを統合する方法を示すことです。この例は[「ベースラインリクエスト記録時のAPI経由でのデプロイ」][link-api-recoding-mode]シナリオに従います。

このドキュメントには次の情報が含まれます:
1.  [サンプルアプリケーションの動作に関する説明][anchor-project-description]
2.  [FAST統合の詳細な手順説明][anchor-cci-integration-description]
3.  [FAST統合のデモ][anchor-cci-integration-demo]

##  サンプルアプリケーションの動作

サンプルアプリケーションは、ブログに投稿を公開し、その投稿を管理できるWebアプリケーションです。

![サンプルアプリケーション][img-demo-app]

アプリケーションはRuby on Railsで実装され、Dockerコンテナとして提供されます。

また、アプリケーションには[RSpec][link-rspec]の統合テストが作成されています。RSpecはWebアプリケーションとのやり取りに[Capybara][link-capybara]を使用し、CapybaraはアプリケーションにHTTPリクエストを送信するために[Selenium][link-selenium]を使用します:

![テストの流れ][img-testing-flow]

RSpecは次のシナリオを対象にいくつかの統合テストを実行します:
* 投稿一覧ページへ移動
* 新規投稿の作成
* 既存投稿の更新
* 既存投稿の削除

CapybaraとSeleniumにより、これらのテストはアプリケーションへの一連のHTTPリクエストに変換されます。

!!! info "テストの配置場所"
    上記の統合テストは`spec/features/posts_spec.rb`ファイルに記述されています。

##  FASTのRSpecおよびCircleCIとの統合方法

ここでは、サンプルプロジェクトにおけるFASTとRSpecおよびCircleCIの統合概要を説明します。

RSpecはテスト前後のフックをサポートしています:

```
config.before :context, type: :feature do
    # RSpecテスト実行前に実行する処理
  end
    # RSpecテストの実行
  config.after :context, type: :feature do
    # RSpecテスト実行後に実行する処理
  end
```

これは本質的に、アプリケーションをテストするRSpecの手順に、FASTによるセキュリティテストの手順を追加できることを意味します。

Seleniumサーバーには`HTTP_PROXY`環境変数でプロキシサーバーを指定できます。これにより、アプリケーションへのHTTPリクエストはプロキシされます。プロキシ機構を利用することで、既存のテストフローへの変更を最小限に抑えつつ、統合テストが発行するリクエストをFASTノード経由で通過させることができます:

![FASTを含むテストの流れ][img-testing-flow-fast]

以上を踏まえてCircleCIジョブを構成します。ジョブは次の手順で構成されています（`.circleci/config.yml`ファイルを参照してください）:

1.  必要な準備:
    
    [トークンを取得][doc-get-token]し、その値を`TOKEN`環境変数としてCircleCIのプロジェクトに渡す必要があります。
新しいCIジョブがセットアップされると、この変数の値はジョブを実行するDockerコンテナに渡されます。
    
    ![CircleCIへトークンを渡す][img-cci-pass-token]
    
2.  サービスのビルド
    
    この段階では、いくつかのサービス用に複数のDockerコンテナをビルドします。コンテナは共有のDockerネットワークに配置されます。したがって、各コンテナはIPアドレスだけでなくコンテナ名でも相互に通信できます。
    
    次のサービスをビルドします（`docker-compose.yaml`ファイルを参照してください）:
    
    * `app-test`: 対象アプリケーションとテストツール用のサービスです。
        
        このサービスのDockerイメージには次のコンポーネントが含まれます:
        
        * 対象アプリケーション（デプロイ後は`app-test:3000`でHTTPアクセス可能）。
        
        * Capybaraと組み合わせたRSpecテストツール。FASTのセキュリティテストを実行するために必要な機能をすべて含みます。
        
        * Capybara: Seleniumサーバー`selenium:4444`を使用して対象アプリケーション`app-test:3000`へHTTPリクエストを送信するように設定されています（`spec/support/capybara_settings.rb`ファイルを参照）。
        
        トークンは`WALLARM_API_TOKEN=$TOKEN`環境変数でこのサービスのコンテナに渡されます。トークンは、`config.before`および`config.after`セクション（`spec/support/fast-helper.rb`ファイルを参照）で記述されている関数によってテストランの操作に使用されます。
    
    * `fast`: FASTノード用のサービス。
        
        デプロイ後、このノードは`fast:8080`でHTTPアクセス可能です。 
        
        トークンは`WALLARM_API_TOKEN=$TOKEN`環境変数でこのサービスのコンテナに渡されます。FASTが正しく動作するためにトークンが必要です。
        
        !!! info "ベースラインリクエストに関する注意"
            提供されている例では、`ALLOWED_HOSTS`[環境変数][doc-env-variables]を使用していません。したがって、FASTノードは受信するすべてのリクエストをベースラインとして認識します。
    
    * `selenium`: Seleniumサーバー用のサービス。`app-test`コンテナ内のCapybaraは動作のためにこのサーバーを使用します。
        
        `HTTP_PROXY=http://fast:8080`環境変数をこのサービスのコンテナに渡し、FASTノード経由でのリクエストプロキシを有効化します。
        
        デプロイ後、このサービスは`selenium:4444`でHTTPアクセス可能です。
        
    すべてのサービス間の関係は次のとおりです:
    
    ![サービス間の関係][img-services-relations]
    
3.  上記の関係により、サービスは次の厳密な順序でデプロイする必要があります:
    1.  `fast`
    2.  `selenium`
    3.  `app-test`
    
    `fast`と`selenium`サービスは、`docker-compose up -d fast selenium`コマンドを実行して順にデプロイします。
    
4.  SeleniumサーバーとFASTノードのデプロイが成功したら、`app-test`サービスをデプロイしてRSpecテストを実行します。
    
    そのために、次のコマンドを実行します:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`。
    
    テストおよびHTTPトラフィックの流れは次の図のとおりです:
    
    ![テストおよびHTTPトラフィックの流れ][img-test-traffic-flow]
    
    [シナリオ][link-api-recoding-mode]に従い、RSpecテストにはFASTのセキュリティテストを実行するために必要なすべての手順が含まれています（`spec/support/fast_hooks.rb`ファイルを参照）:
    
    1.  RSpecテストの実行前にテストランが[作成されます][doc-testrun-creation]。
        
        続いて、FASTノードがベースラインリクエストの記録を開始できる状態かを確認するためにAPI呼び出しが[発行されます][doc-node-ready-for-recording]。ノードが準備完了になるまで既存のテスト実行プロセスは開始されません。
        
        !!! info "使用するテストポリシー"
            この例ではデフォルトのテストポリシーを使用します。
        
    2.  RSpecテストを実行します。
    3.  RSpecテスト完了後、次の処理を実行します:
        1.  ベースラインリクエストの記録を[停止します][doc-stopping-recording]。
        2.  テストランの状態を[定期的に監視します][doc-waiting-for-tests]:
            * FASTのセキュリティテストが正常に完了した場合（テストランの状態が`state: passed`）、RSpecへ終了コード`0`を返します。
            * FASTのセキュリティテストが失敗した場合（脆弱性が検出され、テストランの状態が`state: failed`）、RSpecへ終了コード`1`を返します。
    
5.  テスト結果の取得:
    
    RSpecプロセスの終了コードは`docker-compose run`プロセスに渡され、さらにCircleCIに渡されます。     
    
    ![CircleCIでのジョブ結果][img-cci-pass-results]

説明したCircleCIジョブは、[前述の手順][link-api-recoding-mode]に厳密に従っています:

![CircleCIジョブの詳細][img-cci-workflow]

##  FAST統合のデモ

1.  Wallarm cloudで[FASTノードを作成][doc-get-token]し、提供されたトークンをコピーします。
2.  [サンプルプロジェクトのファイル][link-example-project]を自身のGitHubリポジトリにコピーします。
3.  GitHubリポジトリを[CircleCI][link-circleci]に追加します（CircleCIで「Follow Project」ボタンを押します）。これにより、リポジトリの内容を変更するたびにCIジョブが起動します。なお、CircleCIの用語ではリポジトリは「project」と呼ばれます。
4.  CircleCIのプロジェクトに`TOKEN`環境変数を追加します。これはプロジェクトの設定で行えます。この変数の値としてFASTトークンを渡します:
    
    ![プロジェクトへトークンを渡す][img-cci-demo-pass-token]
    
5.  リポジトリに何かをプッシュしてCIジョブを開始します。RSpecの統合テストが正常に完了していることを確認します（ジョブのコンソール出力を確認してください）:
    
    ![RSpecテストが成功][img-cci-demo-rspec-tests]
    
6.  テストランが実行中であることを確認します。
    
    Wallarmアカウント情報で[Wallarm portal][link-wl-portal]にログインし、[「Testruns」タブ][link-wl-portal-testrun-tab]に移動すると、脆弱性に対するアプリケーションのテストプロセスをリアルタイムで確認できます:
    
    ![テストランの実行][img-cci-demo-testrun]
    
7.  テスト処理が終了すると、CIジョブのステータスが「Failed」と表示されるはずです:
    
    ![CIジョブの完了][img-cci-demo-tests-failed]
    
    今回のテスト対象はWallarmのデモアプリケーションであるため、CIジョブの失敗は、FASTがアプリケーション内で検出した脆弱性を示しています（ビルドのログには「FAST tests have failed」というメッセージが表示されます）。この失敗はビルド関連の技術的問題によるものではありません。
    
    !!! info "エラーメッセージ"
        「FAST tests have failed」というエラーメッセージは、`spec/support/fast_helper.rb`ファイル内の`wait_test_run_finish`メソッドによって、終了コード`1`で終了する直前に出力されます。

8.  テスト中、CircleCIのコンソールには検出された脆弱性に関する情報は表示されません。 

    詳細はWallarm portalで確認できます。そのためには、テストランへのリンクを開きます。このリンクは、CircleCIコンソールに表示されるFASTの情報メッセージの一部として表示されます。
    
    リンクは次のような形式です:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    たとえば、完了したテストランを表示すると、サンプルアプリケーションで複数のXSS脆弱性が見つかったことが分かります:
    
     ![脆弱性の詳細情報][img-cci-demo-vuln-details]
    
まとめとして、FASTは既存のCI/CDプロセスに強力に統合できること、そして統合テストがエラーなく成功した場合でもアプリケーションの脆弱性を検出できることを示しました。