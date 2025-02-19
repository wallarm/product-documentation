[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


# FAST Nodeを介した統合: 原則と手順

CIモードでのセキュリティテストを実施するには、FAST nodeを順次2つのモードで実行する必要があります:
1.  [Recording mode][doc-recording-mode]
2.  [Testing mode][doc-testing-mode]

FAST nodeの動作モードは環境変数`CI_MODE`で定義されます。この変数は以下の値を取ります:
* `recording`
* `testing`

このシナリオでは、まずFAST nodeがテストレコードを作成し、ベースラインリクエストを書き込みます。記録が終了すると、nodeは事前に記録されたベースラインリクエストを元にセキュリティテストを実行するテストランを作成します。  

下図はこのシナリオを示しています:

![CIモードでFAST nodeを使用したCI/CDジョブの例][img-sample-job-ci-mode]

対応するワークフローステップは以下の通りです:

1.  対象アプリケーションのビルドおよびデプロイ。

2.  [Recording modeでFAST nodeを実行][doc-recording-mode].

    Recording modeでは、FAST nodeは以下の動作を行います:
    
    * リクエスト元から対象アプリケーションへのベースラインリクエストをプロキシします。
    * 後でこれらのベースラインリクエストを元にセキュリティテストセットを作成するため、テストレコードに記録します。
    
    !!! info "テストランに関する注意"
        Recording modeではテストランは作成されません。

3.  テストツールの準備および設定:
    
    1.  テストツールのデプロイと基本設定を行います。
    
    2.  [FAST nodeをプロキシサーバとして設定][doc-proxy-configuration].
        
4.  既存のテストを実行します.
    
    FAST nodeは対象アプリケーションへのベースラインリクエストをプロキシし、記録します。
    
5.  FAST nodeコンテナの停止と削除.

    FAST nodeが運用中に重大なエラーに遭遇しなければ、[`INACTIVITY_TIMEOUT`][doc-recording-variables]タイマーが切れるか、CI/CDツールが明示的にコンテナを停止するまで実行されます。
    
    既存のテストが完了した後、FAST nodeを[停止する必要があります][doc-fast-container-stopping]。これにより、ベースラインリクエストの記録プロセスが停止されます。その後、nodeコンテナは廃棄されます。

6.  [Testing modeでFAST nodeを実行][doc-testing-mode].

    Testing modeでは、FAST nodeは以下の動作を行います:
    
    * ステップ4で記録されたベースラインリクエストを基にテストランを作成します。
    * セキュリティテストセットの作成と実行を開始します。
    
7.  テスト結果を取得し、FAST nodeコンテナを停止します.    
    
    FAST nodeが運用中に重大なエラーに遭遇しなければ、セキュリティテストが完了するまで実行されます。nodeは自動的にシャットダウンされ、その後、nodeコンテナは廃棄できます。

## FAST Nodeコンテナのライフサイクル (CIモードによるデプロイ)
   
このシナリオでは、FAST nodeコンテナがまずRecording modeで実行され、その後Testing modeで実行されることを前提としています。 
 
FAST nodeの実行がいずれかのモードで終了すると、nodeコンテナは削除されます。つまり、動作モードが変更されるたびにFAST nodeコンテナが再作成されます。