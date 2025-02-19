[img-fast-node-internals]: ../../images/fast/qsg/en/test-run/18-qsg-fast-test-run-proxy-internals.png
[img-view-recording-cloud]: ../../images/fast/qsg/common/test-run/20-qsg-fast-test-run-baselines-recording.png
[img-request-exec-result]:  ../../images/fast/qsg/common/test-run/22-qsg-fast-test-run-gruyere-request.png
[img-incoming-baselines]:   ../../images/fast/qsg/common/test-run/23-qsg-fast-test-run-processing.png    
[img-xss-found]:            ../../images/fast/qsg/common/test-run/24-qsg-fast-test-run-vuln.png

[link-deployment]:          deployment.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-previous-chapter]:    test-preparation.md
[link-create-tr-gui]:       ../operations/create-testrun.md#creating-a-test-run-via-web-interface

[anchor1]:  #1-create-and-run-the-test-run  
[anchor2]:  #2-execute-the-https-baseline-request-you-created-earlier 

# テストの実行

本章では、セキュリティテストセットの生成と実行の手順をご案内します。テストセットは、[前の章][link-previous-chapter]で作成したテストポリシーとベースラインリクエストを用いて構築されます。必要なすべての手順が完了すると、テストの結果XSS脆弱性が発見されます。

アプリケーションセキュリティテストを開始するために、テストランを作成する必要があります。*Test run*は、一回限りの脆弱性テストプロセスを意味します。各テストランには固有の識別子があり、これはFASTの正しい動作のために重要です。テストランを作成すると、テストランIDとテストポリシーがFASTノードに送信され、その後、ノード上でセキュリティテストプロセスが開始されます。

FASTは、以下の手順でセキュリティテストセットを生成および実行します。

1.  ノードは、テストポリシーとテストランIDが送信されるまで、すべての着信リクエストを透過的にプロキシします。

2.  テストランが作成され実行されると、FASTノードはWallarm cloudからテストポリシーとテストランIDを受信します。

3.  ノードがターゲットアプリケーションへのベースラインリクエストを受信した場合は、以下の処理が行われます:
    1.  ノードは着信リクエストにテストランIDを付与します
    2.  付与されたリクエストはWallarm cloudに保存されます
    3.  初期のベースラインリクエストは変更なしにターゲットアプリケーションへ送信されます
    
    !!! info "ベースラインリクエストの記録プロセス"
        このプロセスは、ベースラインリクエストの記録と呼ばれることが多いです。記録は、cloudのウェブインターフェースからも、Wallarm APIへのAPIコールによっても停止可能です。ノードは、初期ベースラインをターゲットアプリケーションへ送信し続けます。
    
    ノードが最初にテストポリシーとテストランIDを受信すると、ベースライン記録が開始されます。
    
    FASTノードは、環境変数`ALLOWED_HOSTS`を確認することでリクエストがベースラインかどうかを判断します。この変数はFASTノードの[デプロイプロセス][link-deployment]中に設定されました。もしリクエストのターゲットドメインがこの変数で許可されていれば、そのリクエストはベースラインとみなされます。ガイドに従った場合、`google-gruyere.appspot.com`へのすべてのリクエストはベースラインとみなされます。
    
    ターゲットアプリケーション以外へのその他のすべてのリクエストは、変更されることなく透過的にプロキシされます。

4.  FASTノードは、テストランIDに基づきWallarm cloudからすべての記録済みベースラインリクエストを取得します。

5.  FASTノードは、cloudから受信したテストポリシーを使用して、各ベースラインリクエストに対するセキュリティテストを生成します。

6.  生成されたセキュリティテストセットは、ノードからターゲットアプリケーションへリクエストを送信することにより実行されます。テスト結果はテストランIDに紐づけられ、cloudに保存されます。

    ![FASTノード内部処理][img-fast-node-internals]

    !!! info "使用中のテストランについて"
        いずれかの時点で、FASTノード上で実行中のテストランは1つだけです。同一ノードに対して別のテストランを作成すると、現在のテストランの実行が中断されます。
       
セキュリティテストセットの生成と実行プロセスを開始するには、以下の操作を行ってください:

1.  [テストランの作成と実行][anchor1]
2.  [前に作成したHTTPSベースラインリクエストを実行][anchor2]
    
## 1. テストランの作成と実行

Wallarmアカウントのウェブインターフェースから、[手順][link-create-tr-gui]に従いテストランを作成してください。

手順に従った後、テストラン作成時に以下の基本パラメータを設定します:

* テストラン名: `DEMO TEST RUN`
* テストポリシー: `DEMO POLICY`
* FASTノード: `DEMO NODE`

これらの手順には高度な設定は含まれていません。

テストランが保存されると、そのIDが自動的にFASTノードに渡されます。 “Testruns”タブには、作成されたテストランが赤い点の点滅インジケーターとともに表示されます。このインジケーターは、テストランのベースラインリクエストが記録中であることを意味します。

“Baseline req.”カラムをクリックすると、記録中のすべてのベースラインリクエストを確認できます。

![記録されたベースラインリクエストの表示][img-view-recording-cloud]

!!! info "記録開始準備が整ったノードの確認"
    コンソール出力に、`DEMO NODE`という名前のFASTノードが`DEMO TEST RUN`という名前のテストランのベースラインリクエストを記録する準備が整ったことを示すメッセージが表示されるまで待ってください。
    
    ノードがベースラインリクエストの記録準備が整った場合、コンソール出力には以下のようなメッセージが表示されます:
    
    `[info] Recording baselines for TestRun#N ‘DEMO TEST RUN’`
    
    このメッセージが表示されて初めて、ノードはベースラインリクエストに基づいたセキュリティテストセットを生成できるようになります。	

コンソール出力から、`DEMO NODE`という名前のFASTノードが`DEMO TEST RUN`というテストランのベースラインリクエスト記録の準備が整っていることが確認できます。

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
## 2. 前に作成したHTTPSベースラインリクエストの実行

これを実行するには、あらかじめ構成済みのMozilla Firefoxブラウザを使用して、[前に作成した][link-previous-chapter]リンクにアクセスしてください。

!!! info "リンクの例"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

リクエスト実行の結果は以下の通りです:

![リクエスト実行結果][img-request-exec-result]

コンソール出力から、FASTノードがベースラインリクエストを記録したことが確認できます。

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

Wallarm cloudにいくつかのベースラインリクエストが保存されている様子が確認できます:

![受信したベースラインリクエスト][img-incoming-baselines]

本ドキュメントでは、デモ目的として1回のリクエストのみを実行することを推奨します。ターゲットアプリケーションへの追加リクエストがない場合、 “Actions”ドロップダウンメニューから**Stop recording**オプションを選択して、ベースライン記録プロセスを停止してください。

!!! info "テストラン実行プロセスの制御"
    作成したテストランに対して、セキュリティテストセットは非常に高速に生成されました。しかしながら、ベースラインリクエストの数、使用中のテストポリシー、ターゲットアプリケーションの応答速度により、処理にかかる時間は大幅に異なる可能性があります。“Actions”ドロップダウンメニューから適切なオプションを選択することで、テストプロセスを一時停止または停止することが可能です。

テストランは、ベースライン記録が進行していない場合、テストプロセスの完了とともに自動的に停止します。検出された脆弱性に関する簡単な情報は、“Result”カラムに表示されます。実行されたHTTPSリクエストに対して、FASTはXSS脆弱性をいくつか検出するはずです:

![検出された脆弱性][img-xss-found]
    
これで、Google Gruyereアプリケーションに対するHTTPSリクエストのテスト結果とともに、本章の目的がすべて達成されました。結果として、3件のXSS脆弱性が検出されたことが示されています。