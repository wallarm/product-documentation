[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container-with-the-fast-node
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#   Wallarm APIによる統合

デプロイ方法はいくつかあります。
1.  [ベースラインリクエストを記録する場合のAPI経由でのデプロイ][anchor-recording]
2.  [事前記録済みのベースラインリクエストを使用する場合のAPI経由でのデプロイ][anchor-no-recording]


##  ベースラインリクエストを記録する場合のAPI経由でのデプロイ

このシナリオでは、[テストラン][doc-testrun]が作成されます。ベースラインリクエストは、テストランに対応するテストレコードに記録されます。

対応するワークフローの手順は次のとおりです。

1.  対象アプリケーションのビルドとデプロイ

2.  FAST nodeのデプロイとセットアップ
    
    1.  [FAST nodeを含むDockerコンテナのデプロイ][doc-container-deployment]
    
    2.  [テストランの作成][doc-testrun-creation]
    
        これらの操作を実行した後、FAST nodeがベースラインリクエストの記録プロセスを開始できる状態であることを確認します。
    
3.  テストツールの準備とセットアップ
    
    1.  テストツールのデプロイと基本設定の実施
    
    2.  [FAST nodeをプロキシサーバーとして構成][doc-proxy-configuration]
    
4.  既存のテストを実行
    
    最初のベースラインリクエストを受信すると、FAST nodeはセキュリティテストセットの作成と実行を開始します。
    
5.  ベースラインリクエストの記録プロセスの停止
    
    すべての既存のテストが実行された後に、記録プロセスを[停止する必要があります][doc-stopping-recording]。
    
    これで、記録済みのベースラインリクエストを保持する[テストレコード][doc-testrecord]は、既に記録されたベースラインリクエストを用いるCI/CDワークフローで再利用する準備が整いました。  
    
6.  FASTのセキュリティテストの完了待ち
    
    APIリクエストを実行して、テストランのステータスを定期的に確認します。これにより、[セキュリティテストが完了したかどうかを判断できます][doc-waiting-for-tests]。
    
7.  テスト結果の取得

このシナリオを次の図に示します。

![リクエストの記録を伴うCI/CDジョブの例][img-sample-job-recording]


##  事前記録済みのベースラインリクエストを使用する場合のAPI経由でのデプロイ

このシナリオでは、テストランをコピーします。コピー時に、既存のテストレコードIDをテストランに渡します。テストレコードは、ベースラインリクエストの記録を伴うCI/CDワークフローで取得します。

対応するワークフローの手順は次のとおりです。

1.  対象アプリケーションのビルドとデプロイ

2.  FAST nodeのデプロイとセットアップ
    
    1.  [FAST nodeを含むDockerコンテナのデプロイ][doc-container-deployment]
    
    2.  [テストランのコピー][doc-testrun-copying]    

3.  FAST nodeで、指定されたテストレコードからベースラインリクエストを抽出

4.  FAST nodeで対象アプリケーションのセキュリティテストを実施

5.  FASTのセキュリティテストの完了待ち
    
    APIリクエストを実行して、テストランのステータスを定期的に確認します。これにより、[セキュリティテストが完了したかどうかを判断できます][doc-waiting-for-tests]。
    
6.  テスト結果の取得

![事前記録済みリクエストを使用するCI/CDジョブの例][img-sample-job-no-recording]   


##  FAST nodeコンテナのライフサイクル（API経由でのデプロイ）

このシナリオでは、FAST nodeを含むDockerコンテナは、対象のCI/CDジョブにつき1回だけ実行され、ジョブの終了時に削除されることを前提とします。
 
動作中に重大なエラーが発生しない場合、FAST nodeは無限ループで動作し、新しいテストランとベースラインリクエストを待機して対象アプリケーションを再度テストします。
  
CI/CDジョブが終了したら、FAST nodeを含むDockerコンテナはCI/CDツールで明示的に停止する必要があります。 

<!-- -->
必要に応じて、[「FASTを用いたCI/CDワークフロー」][doc-integration-overview]のドキュメントを参照してください。