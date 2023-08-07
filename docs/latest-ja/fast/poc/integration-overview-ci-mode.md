[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#recording-modeでのfast-nodeの実行
[doc-testing-mode]:             ci-mode-testing.md#testing-modeでのfast-nodeの実行
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#recording-modeでのdockerコンテナーを停止させ、削除する方法
[doc-recording-variables]:      ci-mode-recording.md#recording-modeでの環境変数
[doc-integration-overview]:     integration-overview.md

#   FAST Nodeを用いた統合：原理と手順

CIモードによるセキュリティテストを行うためには、FASTノードを次の2つのモードで順番に実行する必要があります：
1.  [記録モード（Recording mode）][doc-recording-mode]
2.  [テストモード（Testing mode）][doc-testing-mode]

`CI_MODE`環境変数はFASTノードの動作モードを決定します。この変数は以下の値を取ることができます：
* `記録モード（recording）`
* `テストモード（testing）`

このシナリオでは、まず、FASTノードがテストレコードを作成し、ベースラインリクエストを記録します。記録が完了したら、ノードは事前に記録されたベースラインリクエストをベースにセキュリティテストを行うテストランを作成します。

このシナリオは以下の画像で表示されています：

![!CIモードのFASTノードを持つCI/CDジョブの例][img-sample-job-ci-mode]

対応するワークフローステップは次の通りです：

1.  ターゲットアプリケーションのビルドとデプロイ。   

2. [FASTノードを記録モードで実行する][doc-recording-mode]。

    記録モードでは、FASTノードが次のアクションを行います：
    
    * ターゲットアプリケーションへのリクエストソースからのベースラインリクエストをプロキシします。
    * これらのベースラインリクエストをテストレコードに記録し、それらを元にセキュリティーテストセットを作成します。
    
    !!! info "テストランについての注釈"
        記録モードでは、テストランは作成されません。

3. テストツールの準備と設定：
    
    1. テストツールをデプロイし、基本的な設定を行います。
    
    2. [FASTノードをプロキシサーバーとして設定します][doc-proxy-configuration]。
        
4. 既存のテストを実行する。
    
    FASTノードは、ターゲットアプリケーションへのベースラインリクエストをプロキシして記録します。
    
5. FASTノードコンテナを停止し、削除します。

    FASTノードが運用中にクリティカルなエラーに遭遇しなかった場合、[`INACTIVITY_TIMEOUT`][doc-recording-variables]タイマーが切れるか、CI/CDツールが明示的にコンテナを停止してくれるまで稼働します。
    
    既存のテストが完了した後、FASTノードを[停止させる必要があります][doc-fast-container-stopping]。これにより、ベースラインリクエストの記録プロセスが停止します。その後、ノードコンテナは廃棄することができます。          

6. [FASTノードをテスティングモードで実行します][doc-testing-mode]。

    テストモードでは、FASTノードが次のアクションを行います：
    
    * ステップ4で記録されたベースラインリクエストに基づいてテストランを作成します。
    * セキュリティテストセットの作成と実行を開始します。
    
7. テストの結果を取得し、FASTノードコンテナを停止します。   
    
    FASTノードが運用中にクリティカルなエラーに遭遇しなかった場合、セキュリティテストが完了するまで稼働します。ノードは自動的にシャットダウンします。その後、ノードコンテナは廃棄することができます。

##  FASTノードコンテナのライフサイクル（CIモードでのデプロイ）
   
このシナリオでは、まず記録モードで動作し、次にテストモードで動作するアプリケーションをFASTノードが実行すると想定しています。
 
どちらのモードでも、FASTノードの実行が終了した後は、ノードコンテナを削除します。つまり、操作モードが変わるたびにFASTノードコンテナが再作成されます。