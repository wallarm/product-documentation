[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


#   FAST nodeによる統合: 原則と手順

CIモードでセキュリティテストを実施するには、FAST nodeを次の2つのモードで順番に実行する必要があります:
1.  [記録モード][doc-recording-mode]
2.  [テストモード][doc-testing-mode]

`CI_MODE`環境変数はFAST nodeの動作モードを定義します。この変数には次の値を設定できます:
* `recording`
* `testing`

このシナリオでは、FAST nodeは最初にテストレコードを作成し、ベースラインリクエストを書き込みます。記録が完了すると、ノードは事前に記録されたベースラインリクエストを基礎として使用するテスト実行を作成し、その上でセキュリティテストを行います。  

このシナリオを以下の図に示します:

![CIモードでFAST nodeを用いたCI/CDジョブの例][img-sample-job-ci-mode]

対応するワークフローの手順は次のとおりです:

1.  対象アプリケーションのビルドとデプロイ。   

2.  [FAST nodeを記録モードで実行する][doc-recording-mode]。

    記録モードでは、FAST nodeは次の処理を行います:
    
    * リクエストの送信元から対象アプリケーションへのベースラインリクエストをプロキシします。
    * これらのベースラインリクエストをテストレコードに記録し、後でそれらに基づくセキュリティテストセットを作成します。
    
    !!! info "テスト実行に関する注意"
        記録モードではテスト実行は作成されません。

3.  テストツールの準備とセットアップ:
    
    1.  テストツールのデプロイと基本設定の実施。
    
    2.  [FAST nodeをプロキシサーバとして構成する][doc-proxy-configuration]。
        
4.  既存のテストを実行します。
    
    FAST nodeは対象アプリケーションへのベースラインリクエストをプロキシし、記録します。
    
5.  FAST nodeコンテナの停止と削除。

    FAST nodeが動作中に致命的なエラーに遭遇しない場合は、[`INACTIVITY_TIMEOUT`][doc-recording-variables]タイマーが満了するか、CI/CDツールが明示的にコンテナを停止するまで動作します。
    
    既存のテストが完了したら、FAST nodeを[停止する必要があります][doc-fast-container-stopping]。これにより、ベースラインリクエストの記録プロセスが停止します。その後、ノードコンテナは削除できます。          

6.  [FAST nodeをテストモードで実行する][doc-testing-mode]。

    テストモードでは、FAST nodeは次の処理を行います:
    
    * 手順4で記録したベースラインリクエストに基づいてテスト実行を作成します。
    * セキュリティテストセットの作成と実行を開始します。
    
7.  テスト結果の取得。FAST nodeコンテナの停止。    
    
    FAST nodeが動作中に致命的なエラーに遭遇しない場合、セキュリティテストが完了するまで動作します。ノードは自動的にシャットダウンします。その後、ノードコンテナは削除できます。

##  FAST nodeコンテナのライフサイクル (CIモードによるデプロイ)
   
このシナリオでは、FAST nodeを含むDockerコンテナはまず記録モードで実行され、その後テストモードで実行されることを前提としています。 
 
いずれのモードでもFAST nodeの実行が終了したら、ノードコンテナは削除されます。言い換えると、動作モードが切り替わるたびにFAST nodeコンテナは再作成されます。