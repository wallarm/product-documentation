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

# Wallarm APIによる統合

デプロイメントの方法は以下の通りです:
1.  [ベースラインリクエストの記録中にAPIを介してデプロイする][anchor-recording]
2.  [事前に記録されたベースラインリクエストを使用する場合のAPIによるデプロイメント][anchor-no-recording]

## ベースラインリクエストの記録中にAPIを介してデプロイする

このシナリオでは、[テスト実行][doc-testrun]が作成されます。ベースラインリクエストはテスト実行に対応するテストレコードに記録されます。

対応するワークフローステップは以下の通りです:

1.  ターゲットアプリケーションのビルドとデプロイです。

2.  FAST nodeのデプロイとセットアップです:
    
    1.  [FAST nodeを含むDocker containerのデプロイ][doc-container-deployment].
    
    2.  [テスト実行の作成][doc-testrun-creation].
    
        これらの操作を実行後、FAST nodeがベースラインリクエストの記録プロセスを開始する準備が整っていることを確認してください。
    
3.  テストツールの準備とセットアップです:
    
    1.  テストツールのデプロイと基本設定を行います。
    
    2.  [FAST nodeをプロキシサーバーとして設定する][doc-proxy-configuration].
    
4.  既存のテストを実行します。
    
    FAST nodeは最初のベースラインリクエストを受信すると、セキュリティテストセットの作成と実行を開始します。
    
5.  ベースラインリクエストの記録プロセスを停止します。
    
    既存のすべてのテスト実行後、記録プロセスを[停止する][doc-stopping-recording]必要があります。
    
    これで、記録されたベースラインリクエストを保持する[test record][doc-testrecord]が、すでに記録されたベースラインリクエストを使用するCI/CDワークフローで再利用可能な状態となります。  
    
6.  FASTセキュリティテストの完了を待ちます。
    
    定期的にAPIリクエストを行い、テスト実行のステータスを確認してください。これにより、セキュリティテストの完了状況を[確認できます][doc-waiting-for-tests]。
    
7.  テスト結果を取得します。

このシナリオは、下記の画像に示されています:

![リクエスト記録を行ったCI/CDジョブの例][img-sample-job-recording]

## 事前に記録されたベースラインリクエストを使用する場合のAPIによるデプロイ

このシナリオでは、テスト実行がコピーされます。コピー中、既存のテストレコード識別子がテスト実行に渡されます。テストレコードは、ベースラインリクエストの記録を行うCI/CDワークフローで取得されます。

対応するワークフローステップは以下の通りです:

1.  ターゲットアプリケーションのビルドとデプロイです。

2.  FAST nodeのデプロイとセットアップです:
    
    1.  [FAST nodeを含むDocker containerのデプロイ][doc-container-deployment].
    
    2.  [テスト実行のコピー][doc-testrun-copying].    

3.  FAST nodeを使用し、指定されたテストレコードからベースラインリクエストを抽出します。

4.  FAST nodeを用いてターゲットアプリケーションのセキュリティテストを実施します。

5.  FASTセキュリティテストの完了を待ちます.
    
    定期的にAPIリクエストを行い、テスト実行のステータスを確認してください。これにより、セキュリティテストの完了状況を[確認できます][doc-waiting-for-tests].
    
6.  テスト結果を取得します.

![事前に記録されたリクエストを使用したCI/CDジョブの例][img-sample-job-no-recording]

## FAST Node Containerのライフサイクル（APIを介したデプロイ）

このシナリオでは、FAST node入りのDocker containerは特定のCI/CDジョブに対して一度のみ実行され、ジョブ終了時に削除されることを前提としています。
 
もし運用中にFAST nodeが重大なエラーに遭遇しなければ、無限ループで実行され、新たなテスト実行やベースラインリクエストを待機し、ターゲットアプリケーションの再テストを行います。
  
CI/CDジョブが完了した際、CI/CDツールによって明示的にNode入りのDocker containerを停止する必要があります。 

<!-- -->
必要に応じて、[「FASTを使用したCI/CDワークフロー」][doc-integration-overview]ドキュメントを参照してください。