[img-sample-job-recording]:     ../../images/fast/poc/jp/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/jp/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#テスト-ラン
[doc-container-deployment]:     node-deployment.md#dockerコンテナのデプロイ
[doc-testrun-creation]:         node-deployment.md#テストランの作成
[doc-testrun-copying]:          node-deployment.md#テストランのコピー
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#テスト-レコード
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #api経由でのデプロイ-初期リクエストが記録される場合
[anchor-no-recording]:          #api経由でのデプロイ-事前記録済みの初期リクエストが使われる場合

[doc-integration-overview]:     integration-overview.md

#   Wallarm APIを通じた統合

デプロイ方法にはいくつかあります：
1.  [API経由でのデプロイで、初期リクエストが記録される場合。][anchor-recording]
2.  [API経由でのデプロイで、事前に記録された初期リクエストが利用される場合。][anchor-no-recording]


##  API経由でのデプロイ時に基本リクエストが記録される

このシナリオでは、[テストラン][doc-testrun]が作成されます。ベースラインリクエストは、テストランに対応するテストレコードに記録されます。

対応するワークフローステップは次のとおりです：

1.  対象となるアプリケーションの構築とデプロイメント。

2.  FASTノードのデプロイメントと設定：
    
    1.  [FASTノード付きのDockerコンテナのデプロイメント][doc-container-deployment]。
    
    2.  [テストランの作成][doc-testrun-creation]。
    
        これらのアクションを実行した後、FASTノードがベースラインリクエストの記録プロセスを開始するために準備が整っていることを確認してください。
    
3.  テストツールの準備と設定：
    
    1.  テストツールのデプロイメントと基本的な設定。
    
    2.  [FASTノードをプロキシサーバーとして設定する][doc-proxy-configuration]。
    
4.  既存のテストの実行。
    
    FASTノードは、最初のベースラインリクエストを受け取ったときに、セキュリティテストセットの作成と実行を開始します。
    
5.  初期リクエストの記録プロセスを停止します。
    
    記録プロセスは、すべての既存のテストが実行された後に[停止][doc-stopping-recording]するべきです。
    
    これで、記録された初期リクエストを保持する[テストレコード][doc-testrecord]は、すでに記録された初期リクエストを用いて作業するCI/CDワークフローに再利用可能となります。  
    
6.  FASTのセキュリティテストが終了するのを待つ。
    
    定期的にAPIリクエストによりテストランのステータスをチェックします。これによって、セキュリティテストが完了したかどうか[判断][doc-waiting-for-tests]できます。
    
7.  テストの結果を取得する。

このシナリオは以下の画像で示されています：

![!リクエスト記録があるCI/CDジョブの例][img-sample-job-recording]


##  事前に記録された基本リクエストが使用されるAPIを介したデプロイ

このシナリオでは、テストランがコピーされます。コピー時に、既存のテストレコード識別子がテストランに渡されます。テストレコードは、初期リクエスト記録を伴うCI/CDワークフローに取得されます。

対応するワークフローステップは次のとおりです：

1.  対象となるアプリケーションの構築とデプロイメント。

2.  FASTノードのデプロイメントと設定：
    
    1.  [FASTノード付きのDockerコンテナのデプロイメント][doc-container-deployment]。
    
    2.  [テストランのコピー][doc-testrun-copying]。    

3.  FASTノードを使って指定されたテストレコードから初期リクエストを抽出します。 

4.  FASTノードを使用して目標アプリケーションのセキュリティテストを実施します。

5.  FASTのセキュリティテストが終了するのを待つ。
    
    定期的にAPIリクエストによりテストランのステータスをチェックします。これによって、セキュリティテストが完了したかどうか[判断][doc-waiting-for-tests]できます。
    
6.  テストの結果を取得する。

![!事前に記録されたリクエストを使用したCI/CDジョブの例][img-sample-job-no-recording]   


##  FASTノードコンテナのライフサイクル（API経由でのデプロイ）

このシナリオでは、FASTノードが付属したDockerコンテナはCI/CDジョブごとに一度だけ実行され、ジョブが終了すると削除されることを前提としています。
 
FASTノードが操作中に深刻なエラーに遭遇しない限り、新しいテストランと初期リクエストを待つ無限ループで動作します。
  
ジョブ完了時には、CI/CDツールによって明示的にFASTノードのDockerコンテナを停止する必要があります。

<!-- -->
必要に応じて、[「FASTを使ったCI/CDワークフロー」][doc-integration-overview]ドキュメントを参照してください。