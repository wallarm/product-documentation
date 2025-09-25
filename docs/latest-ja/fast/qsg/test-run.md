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

    
    
#   テストの実行

本章では、セキュリティテストセットの生成と実行の手順をご案内します。テストセットは、[前の章][link-previous-chapter]で作成したテストポリシーとベースラインリクエストを用いて構築されます。必要な手順をすべて完了すると、テストの結果としてXSS脆弱性が見つかります。

アプリケーションのセキュリティテストを開始するには、テストランを作成する必要があります。*テストラン*は一回限りの脆弱性テストプロセスを表します。各テストランには一意の識別子があり、FASTの正しい動作に不可欠です。テストランを作成すると、テストランIDとテストポリシーがFAST nodeに送信されます。その後、ノード上でセキュリティテストプロセスが開始されます。

FASTは次の手順でセキュリティテストセットを生成・実行します:

1.  ノードは、テストポリシーとテストランIDが送信されるまで、受信するすべてのリクエストを透過的にプロキシします。

2.  テストランが作成・開始されると、FAST nodeはWallarm cloudからテストポリシーとテストランIDを受け取ります。

3.  ノードが対象アプリケーション宛てのベースラインリクエストを受信した場合:
    1.  ノードは受信リクエストにテストランIDを付与します
    2.  付与されたリクエストはWallarm cloudに保存されます
    3.  初回のベースラインリクエストは変更せずに対象アプリケーションへ送信されます
    
    !!! info "ベースラインリクエストの記録プロセス"
        このプロセスはベースラインリクエストの記録と呼ばれることがよくあります。記録はクラウドのWebインターフェイスから、またはWallarm APIへのAPIコールで停止できます。ノードは初期のベースラインを対象アプリケーションへ送信し続けます。
    
    ベースラインの記録は、ノードが先にテストポリシーとテストランIDを受け取った場合に開始されます。
    
    FAST nodeは、環境変数`ALLOWED_HOSTS`を確認してリクエストがベースラインかどうかを判定します。この変数はFAST nodeの[デプロイ手順][link-deployment]で設定しました。リクエストの宛先ドメインがこの変数で許可されている場合、そのリクエストはベースラインと見なされます。本ガイドに従っている場合、`google-gruyere.appspot.com`ドメインへのすべてのリクエストはベースラインと見なされます。
    
    それ以外の、対象アプリケーション向けでないリクエストは、変更せず透過的にプロキシされます。

4.  FAST nodeはテストランIDに基づいてWallarm cloudから記録済みのベースラインリクエストをすべて取得します。

5.  FAST nodeは、クラウドから受け取ったテストポリシーを用いて各ベースラインリクエストのセキュリティテストを生成します。

6.  生成されたセキュリティテストセットは、ノードから対象アプリケーションへリクエストを送信することで実行されます。テスト結果はテストランIDに関連付けられ、クラウドに保存されます。

    ![FAST nodeの内部ロジック][img-fast-node-internals]

    !!! info "稼働中のテストランに関する注意"
        任意の時点で、FAST node上で同時に実行できるテストランは1つだけです。同じノードに対して別のテストランを作成すると、現在のテストランの実行は中断されます。
       
セキュリティテストセットの生成と実行を開始するには、以下を実施します:

1.  [テストランを作成して開始する][anchor1]
2.  [前に作成したHTTPSベースラインリクエストを実行する][anchor2]
    
##  1.  テストランを作成して開始する  

WallarmアカウントのWebインターフェイスから[手順][link-create-tr-gui]に従ってテストランを作成します。

手順に従った後、テストラン作成時に次の基本パラメータを設定します:

* テストラン名: `DEMO TEST RUN`;
* テストポリシー: `DEMO POLICY`;
* FAST node: `DEMO NODE`.

本手順には高度な設定は含まれていません。

テストランを保存すると、そのIDが自動的にFAST nodeへ渡されます。“Testruns”タブには、作成したテストランが赤い点滅ドットのインジケーター付きで表示されます。このインジケーターは、そのテストランのベースラインリクエストが記録中であることを示します。

記録中のベースラインリクエストをすべて表示するには、“Baseline req.”列をクリックできます。

![記録済みベースラインリクエストの表示][img-view-recording-cloud]

!!! info "記録のためのノードの準備完了"
    テストラン`DEMO TEST RUN`のベースラインリクエストを記録する準備が`DEMO NODE`というFAST nodeで整ったことを示すコンソール出力が表示されるまでお待ちください。
    
    ノードがベースラインリクエストの記録を開始できる状態になると、コンソール出力に次のようなメッセージが表示されます:
    
    `[info] Recording baselines for TestRun#N ‘DEMO TEST RUN’`
    
    このメッセージが表示されてからでないと、ノードはベースラインリクエストに基づくセキュリティテストセットを生成できません。	

コンソール出力から、`DEMO NODE`というFAST nodeが、`DEMO TEST RUN`というテストランのベースラインリクエスト記録の準備ができていることが確認できます:

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  以前に作成したHTTPSベースラインリクエストを実行する

それには、事前に設定済みのMozilla Firefoxブラウザを使用して、[作成済みのリンク][link-previous-chapter]にアクセスします。

!!! info "リンクの例"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

リクエスト実行の結果を以下に示します:

![リクエスト実行の結果][img-request-exec-result]

コンソール出力から、FAST nodeがベースラインリクエストを記録したことが確認できます:

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

ベースラインリクエストがWallarm cloudに保存されていく様子を確認できます:

![受信中のベースラインリクエスト][img-incoming-baselines]

本ドキュメントでは、デモ目的のため、実行するリクエストは1つのみとすることを推奨します。対象アプリケーションへの追加リクエストがないことを前提に、“Actions”ドロップダウンメニューから**Stop recording**オプションを選択し、ベースラインの記録プロセスを停止します。

!!! info "テストラン実行プロセスの制御"
    作成したテストランでは、セキュリティテストセットは比較的すぐに生成されました。ただし、ベースラインリクエストの数、使用しているテストポリシー、対象アプリケーションの応答性によっては、このプロセスに相当な時間がかかる場合があります。“Actions”ドロップダウンメニューから適切なオプションを選択することで、テストプロセスを一時停止または停止できます。

ベースラインの記録が実行されていない状態でテストプロセスが完了すると、テストランは自動的に停止します。“Result”列に検出された脆弱性の簡易情報が表示されます。実行したHTTPSリクエストに対して、FASTはXSS脆弱性をいくつか検出するはずです:

![検出された脆弱性][img-xss-found]
    
これで本章の目標はすべて達成され、Google GruyereアプリケーションへのHTTPSリクエストをテストした結果が得られました。結果にはXSS脆弱性が3件見つかったことが示されています。