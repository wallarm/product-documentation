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

[anchor-project-description]:           #sample-application-description
[anchor-cci-integration-description]:   #how-fast-integrates-with-RSpec-and-circleci
[anchor-cci-integration-demo]:          #fast-integration-demo

#   CI/CDへのFAST統合の例

!!! info "章の規約"
    本章全体にわたり、次のトークン値が例示の値として使用されています:`token_Qwe12345`。

WallarmのGitHubにて利用可能なサンプルプロジェクト[fast-example-api-circleci-rails-integration][link-example-project]。その目的は、既存のCI/CDプロセスにFASTを統合する方法を示すことです。この例は、[“API経由のデプロイメント時にベースラインリクエストの記録が行われる”][link-api-recoding-mode] シナリオに従っています。

このドキュメントには、以下の情報が含まれています：
1.  [サンプルアプリケーションの動作方法についての説明。][anchor-project-description]
2.  [FAST統合の詳細なステップバイステップの説明。][anchor-cci-integration-description]
3.  [FAST統合のアクションのデモ。][anchor-cci-integration-demo]

##  サンプルアプリケーションの動作の仕方

サンプルアプリケーションは、ブログに投稿を公開することと、ブログの投稿を管理する機能を持つウェブアプリケーションです。

![サンプルアプリケーション][img-demo-app]

このアプリケーションはRuby on Railsで記述され、Dockerコンテナとして出荷されています。

また、アプリケーションのための[RSpec][link-rspec]統合テストが作成されています。RSpecは、ウェブアプリケーションと対話するために[Capybara][link-capybara]を利用し、CapybaraはアプリケーションへのHTTPリクエストを送信するために[Selenium][link-selenium]を使用します：

![テストフロー][img-testing-flow]

RSpecは以下のシナリオをテストするためのいくつかの統合テストを実行します：
* 投稿のページに移動する
* 新しい投稿を作成する
* 既存の投稿を更新する
* 既存の投稿を削除する

CapybaraとSeleniumは、これらのテストをアプリケーションへのHTTPリクエストのセットに変換するのに役立ちます。

!!! info "テストのロケーション"
    上記の統合テストは、 `spec/features/posts_spec.rb` ファイルで記述されています。

##  FASTがRSpecとCircleCIとどのように統合するか

ここでは、サンプルプロジェクトでのRSpecとCircleCIとのFAST統合の概要をご紹介します。

RSpecは前テストと後テストのフックをサポートしています：

```
config.before :context, type: :feature do
    # RSpecテストの実行前に行うアクション
  end
    # RSpecテストの実行
  config.after :context, type: :feature do
    # RSpecテストの実行後に行うアクション
  end
```

これは基本的に、アプリケーションのテストにRSpecが踏むステップをFASTセキュリティテストを含むステップで補強することが可能であることを意味します。

私たちは、`HTTP_PROXY` 環境変数を使用してSeleniumサーバーをプロキシサーバーにポイントすることができます。したがって、アプリケーションへのHTTPリクエストがプロキシされます。プロキシングメカニズムの利用は、既存のテストフローへの最小限の介入で統合テストによって発行されたリクエストをFASTノードを通じて渡すことを可能にします：

![FASTでのテストフロー][img-testing-flow-fast]

上記の事実を考慮に入れてCircleCIジョブが構築されます。このジョブは、以下のステップを含む(`.circleci/config.yml` ファイルを参照) ：

1.  必要な準備：
    
    [トークンを取得][doc-get-token]する必要があり、その値を `TOKEN` 環境変数を介してCircleCIプロジェクトに渡します。新しいCIジョブが設置されると、その変数の値はジョブが実行されるDockerコンテナに渡されます。
    
    ![CircleCIにトークンを渡す][img-cci-pass-token]
    
2.  サービスの構築
    
    この段階では、セットのサービス用にいくつかのDockerコンテナを構築する必要があります。コンテナは共有Dockerネットワークに配置されているため、IPアドレスだけでなくコンテナの名前を使用して相互に通信できます。
    
    以下のサービスが構築されます(`docker-compose.yaml` ファイルを参照)：
    
    * `app-test`: ターゲットアプリケーションとテストツールのサービス。
        
        このサービスのDockerイメージは以下のコンポーネントを含みます：
        
        * ターゲットアプリケーション（デプロイ後は `http://app-test:3000` でHTTP経由でアクセス可能）。
        
        * RSpecテストツールに組み入れたCapybara；ツールにはFASTセキュリティテストを実行するために必要なすべての関数が含まれています。
        
        * Capybara: Seleniumサーバー `selenium:4444` を使用してターゲットアプリケーション `app-test:3000` へのHTTPリクエストを送信するように設定されています（ `spec/support/capybara_settings.rb` ファイルを参照）。
        
        トークンは、 `WALLARM_API_TOKEN=$TOKEN` 環境変数を介してサービスのコンテナに渡されます。トークンは `config.before` と `config.after` セクションで説明されている関数がテストランを操作するために使用する（ `spec/support/fast-helper.rb` ファイルを参照）。
    
    * `fast`: FASTノードのサービス。
        
        ノードはデプロイ後 `fast:8080` でHTTP経由でアクセス可能です。
        
        トークンは `WALLARM_API_TOKEN=$TOKEN` 環境変数を介してサービスのコンテナに渡されます。トークンは適切なFASTの操作に必要です。
        
        !!! info "ベースラインリクエストに関する注釈"
            提供された例では `ALLOWED_HOSTS` [環境変数][doc-env-variables]を使用していません。したがって、FASTノードはすべての着信リクエストをベースラインのものとして認識します。
    
    * `selenium`: Seleniumサービスのサーバー。 `app-test` コンテナのCapybaraはその操作にサーバーを使用します。
        
        サービスのコンテナに `HTTP_PROXY=http://fast:8080` 環境変数が渡され、FASTノードを通じてリクエストのプロキシを可能にします。
        
        サービスはデプロイ後 `selenium:4444` でHTTP経由でアクセス可能です。
        
    すべてのサービスはそれらの間に以下の関係を形成します：
    
    ![サービス間の関係][img-services-relations]
    
3.  上記の関係性のため、サービスは以下の厳密な順序でデプロイする必要があります：
    1.  `fast`.
    2.  `selenium`.
    3.  `app-test`.
    
    `fast` と `selenium` サービスは `docker-compose up -d fast selenium` コマンドを発行することにより順次デプロイされます。
    
4.  SeleniumサーバーとFASTノードのデプロイが成功したら、 `app-test` サービスをデプロイし、RSpecテストを実行する時が来ます。
    
    これを行うために、次のコマンドが発行されます：
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    テストとHTTPのトラフィックフローは画像の中に表示されます：
    
    ![テストとHTTPトラフィックフロー][img-test-traffic-flow]
    
    [シナリオ][link-api-recoding-mode]に従って、RSpecテストはFASTセキュリティテストを実行するために必要なすべてのステップを含みます(`spec/support/fast_hooks.rb` ファイルを参照)：
    
    1.  RSpecテストの実行前にテストランが[作成されます][doc-testrun-creation]。
        
        次に、FASTノードがベースラインリクエストの記録を準備できているかどうかを確認するためのAPI呼び出しが[発行されます][doc-node-ready-for-recording]。ノードが準備できているまで既存のテストの実行プロセスは開始されません。
        
        !!! info "使用中のテストポリシー"
            この例ではデフォルトのテストポリシーを使用しています。
        
    2.  RSpecテストが実行されます。
    3.  RSpecテストが終了した後、次のアクションが実行されます：
        1.  ベースラインリクエストの記録プロセスが[停止します][doc-stopping-recording]；
        2.  テストランの状態が周期的に[監視されます][doc-waiting-for-tests]：
            * FASTセキュリティテストが成功裏に完了した場合（テストランの状態が `state: passed`）、RSpecに終了コード `0` が返されます。
            * FASTセキュリティテストが不成功に終了した場合（いくつかの脆弱性が検出され、テストランの状態が `state: failed`）、RSpecに終了コード `1` が返されます。
    
5.  テスティング結果が得られます：
    
    RSpecプロセスの終了コードが `docker-compose run` プロセスに渡され、その後CircleCIに渡されます。     
    
    ![CircleCIジョブの結果][img-cci-pass-results]

説明されたCircleCIジョブは、先にリスト化されたステップに密接に従います：

![CircleCIジョブの詳細][img-cci-workflow]

##  FAST統合のデモ

1.  Wallarmクラウドで[FASTノードを作成][doc-get-token]し、提供されたトークンをコピーします。
2.  ご自身のGitHubリポジトリに[サンプルプロジェクトファイル][link-example-project]をコピーします。
3.  GitHubリポジトリを[CircleCI][link-circleci]に追加します（CircleCIで「フォロープロジェクト」ボタンを押す）。これにより、リポジトリの内容が変更されるたびにCIジョブが発火します。リポジトリはCircleCIの用語では「プロジェクト」と呼ばれます。
4.  自身のCircleCIプロジェクトに `TOKEN` 環境変数を追加します。これはプロジェクトの設定で行うことができます。この変数の値としてFASTトークンを渡します：
    
    ![プロジェクトにトークンを渡す][img-cci-demo-pass-token]
    
5.  CIジョブを開始するためにリポジトリに何かをプッシュします。RSpec統合テストが成功裏に終了したことを確認してください（ジョブのコンソール出力を参照）：
    
    ![RSpecテストが合格][img-cci-demo-rspec-tests]
    
6.  テストランが実行中であることを確認します。
    
    Wallarmアカウント情報を使用して[Wallarmポータル][link-wl-portal]にログインし、アプリケーションの脆弱性に対するテストプロセスをリアルタイムで観察するために[“Testruns”タブ][link-wl-portal-testrun-tab]に移動します：
    
    ![テストランの実行][img-cci-demo-testrun]
    
7.  テストプロセスが終了した後、CIジョブのステータスが「Failed」であることが報告されます：
    
    ![CIジョブの完了][img-cci-demo-tests-failed]
    
    テスト中のものがWallarmのデモアプリケーションであることを考慮に入れると、失敗したCIジョブはFASTがアプリケーションで検出した脆弱性を表しています（ビルドログファイルに「FASTテストが失敗しました」のメッセージが表示されるはずです）。この場合、失敗はビルド関連の技術的な問題によって引き起こされてはいません。
    
    !!! info "エラーメッセージ"
        「FASTテストが失敗しました」というエラーメッセージは、 `wait_test_run_finish` 方法によって生成され、それは `spec/support/fast_helper.rb` ファイルにあり、終了コード `1` で終了する前にそれです。

8.  テストプロセス中にCircleCIコンソールに表示される検出された脆弱性の情報はありません。

    Wallarmポータルで詳細に脆弱性を探査することができます。これを行うには、テストランリンクに移動します。このリンクは、CircleCIコンソールでFAST情報メッセージの一部として表示されます。
    
    このリンクは次のようになるはずです：
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    たとえば、完了したテストランを見て、サンプルアプリケーションでいくつかのXSS脆弱性が見つかったことが分かります：
    
     ![脆弱性に関する詳細情報][img-cci-demo-vuln-details]
    
結論として、統合テストがエラーなしで通過してもアプリケーションの脆弱性を見つけるために、FASTが既存のCI/CDプロセスへの統合に強力な機能を持っていることが実証されました。