[doc-about-tr-token]:   internals.md

[img-testrun-velocity]: ../../images/fast/poc/en/checking-testrun-status/testrun-velocity.png
[img-status-passed]:         ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:         ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:     ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:          ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:        ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:    ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-test-runs]:             ../../images/fast/poc/en/checking-testrun-status/test-runs.png

[link-wl-portal-testruns-in-progress]:  https://us1.my.wallarm.com/testing/?status=running

[link-integration-chapter]:         integration-overview.md
[link-vuln-list]:                   ../vuln-list.md

[anchor-testrun-estimates]:         #estimates-of-test-runs-execution-speed-and-time-to-completion

[doc-testrun-copying]:              copy-testrun.md
[doc-stop-recording]:               stop-recording.md

# テストランの状態の確認

最初のベースラインリクエストが記録されたときにテストリクエストの作成と実行のプロセスが始まり、ベースラインリクエストの記録のプロセスが[停止][doc-stop-recording]された後もかなりの時間続くことがあります。実行中のプロセスについてどのような洞察を得るために、テストランの状態を確認することができます。これには、次の方法が使用できます。

* [Wallarm UIを通じての状態の確認](#wallarm-uiを通じての状態の確認)
* [APIメソッドを使用しての状態の確認](#apiメソッドを使用しての状態の確認)

## Wallarm UIを通じての状態の確認

テストランの状態はWallarm UIでリアルタイムで表示されます。状態を確認するには：

1. [US cloud](https://us1.my.wallarm.com/)または[EU cloud](https://my.wallarm.com/)でWallarmアカウントにログインします。
2. **Test runs**セクションを開き、必要なテストランをクリックします。

![テストの実行の例][img-test-runs]

それぞれのベースラインリクエストに対して状態が表示されます：

* **合格** ![ステータス：合格][img-status-passed]

    与えられたベースラインリクエストに対して脆弱性が見つからなかった。

* **進行中** ![ステータス：進行中][img-status-inprogress]
              
    ベースラインリクエストが脆弱性のテスト中であります。

* **失敗** ![ステータス：失敗][img-status-failed]

    与えられたベースラインリクエストに対して脆弱性が見つかりました。各ベースラインリクエストに対して脆弱性の詳細へのリンクと脆弱性の数が表示されます。
            
* **エラー** ![ステータス：エラー][img-status-error]
            
    表示されたエラーが原因でテスト過程が停止しました：

    * `Connection failed`：ネットワークエラー
    * `Auth failed`：認証パラメータが存在しないか、間違っています
    * `Invalid policies`：設定したテストポリシーの適用に失敗しました
    * `Internal exception`：セキュリティテスト設定に問題あり
    * `Recording error`：リクエストパラメータが間違っているか、存在しない

* **待機中** ![ステータス：待機中][img-status-waiting]

    ベースラインリクエストがテストのために待機しています。一度にテストできるリクエストの数は限られています。
            
* **中断** ![ステータス：中断][img-status-interrupted]
        
    テスト過程は、**Interrupt testing**ボタンによる中断か、同じFASTノード上で別のテストランが実行されたために中断されました。

## APIメソッドを使用しての状態の確認

!!! info "必要なデータ"
    下記の手順を進めるには、次のデータが必要です：
    
    * トークン
    * テストランの識別子
    
    テストランとトークンについての詳細情報は[こちら][doc-about-tr-token]で確認できます。
    
    本ドキュメントでは、以下の値を例として使用しています：

    * `token_Qwe12345` トークンとして。
    * `tr_1234` テストランの識別子として。

!!! info "テストランの状態をチェックするための適切な時間帯の選び方"
    テストランの状態は、事前に定義された時間帯（例えば、15秒）で確認できます。あるいは、テストランの完了予定時刻を使用して次のチェックを行う時間を決定できます。この予定時間は、テストランの状態を確認するときに取得できます。[下記の詳細を参照してください。][anchor-testrun-estimates]


テストランの状態を一度だけ確認するためには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id`にGETリクエストを送信します：

--8<-- "../include-ja/fast/operations/api-check-testrun-status.md"

もしAPIサーバへのリクエストが成功した場合、サーバのレスポンスが表示されます。レスポンスには、以下の有用な情報が提供されます：

* `vulns`：ターゲットアプリケーションで検出された脆弱性に関する情報が含まれる配列。各脆弱性レコードには、特定の脆弱性に関する以下のデータが含まれています：
    * `id`：脆弱性の識別子。

    * `threat`：脆弱性の脅威レベルを示す1から100の範囲の数値。レベルが高いほど、脆弱性は深刻です。
    * `code`：脆弱性に割り当てられたコード。

    * `type`：脆弱性のタイプ。パラメータは[ここ][link-vuln-list]で説明されている値のいずれかになります。
    
* `state`：テストランの状態。パラメータは以下の値をとることができます：
    * `cloning`：ベースラインリクエストのクローニングが進行中（テストランの[コピーを作成][doc-testrun-copying]するとき）。
    * `running`：テストランが実行中。
    * `paused`：テストランの実行が一時停止しています。
    * `interrupted`：テストランの実行が中断されています（例：現在のテストランがこのノードで行われている間に、FASTノードの新しいテストランが作成されました）。
    * `passed`：テストランの実行が成功（脆弱性は見つからなかった）。
    * `failed`：テストランの実行が失敗（いくつかの脆弱性が見つかった）。

* `baseline_check_all_terminated_count`：すべてのテストリクエストのチェックが完了したベースラインリクエストの数。
    
* `baseline_check_fail_count`：テストリクエストの一部のチェックが失敗したベースラインリクエストの数（つまり、FASTが脆弱性を見つけた）。
    
* `baseline_check_tech_fail_count`：テクニカルな問題によりテストリクエストの一部のチェックが失敗したベースラインリクエストの数（例えば、ターゲットアプリケーションが一部の時間利用できなかった場合など）。
    
* `baseline_check_passed_count`：すべてのテストリクエストのチェックが合格したベースラインリクエストの数（つまり、FASTは脆弱性を見つけませんでした）。

* `baseline_check_running_count`：テストリクエストのチェックがまだ進行中であるベースラインリクエストの数。
    
* `baseline_check_interrupted_count`：すべてのテストリクエストのチェックが中断されたベースラインリクエストの数（例えば、テストランの中断による）。
    
* `sended_requests_count`：ターゲットアプリケーションに送信したテストリクエストの総数。

* `start_time`と`end_time`：テストランが開始され、終了した時間。時間はUNIX時間形式で指定されます。
    
* `domains`：ベースラインリクエストが対象としたターゲットアプリケーションのドメイン名のリスト。
    
* `baseline_count`：記録されたベースラインリクエストの数。

* `baseline_check_waiting_count`：チェック待ちのベースラインリクエストの数。

* `planing_requests_count`：ターゲットアプリケーションに送信予定のテストリクエストの総数。

### テストランの実行速度と完了時間の見積もり

APIサーバのレスポンスには、テストランの実行速度と完了時間を見積もることができる別のパラメータグループがあります。このグループには、以下のパラメータが含まれています：

* `current_rps`：現在、FASTがターゲットアプリケーションにリクエストを送信している速度（テストランの状態取得時点）。

    この値は、平均リクエスト毎秒（RPS）です。この平均RPSは、テストランの状態が取得される10秒間隔の前にFASTがターゲットアプリケーションに送信したリクエストの数として計算されます。

    **例：**
    もしテストランの状態が12:03:01に取得された場合、`current_rps`パラメータの値は、*[12:02:51-12:03:01]時間帯に送信されたリクエストの数/10*として計算されます。

* `avg_rps`：平均的にFASTがターゲットアプリケーションにリクエストを送信している速度（テストランの状態取得時点）。

    この値は、*テストランの実行全体の時間*でFASTがターゲットアプリケーションに送信した平均リクエスト毎秒（RPS）数です：

    * テストランがまだ実行中である場合、テストランの実行開始から現在の時間まで（これは`現在の時間`-`start_time`に等しい）。
    * テストランの実行が完了している場合、テストランの実行開始からテストランの実行終了まで（これは`end_time`-`start_time`に等しい）。

        `avg_rps`パラメータの値は、*(`sended_requests_count`/(テストランの実行全時間))*として計算されます。

* `estimated_time_to_completion`：テストランの実行が完了すると予測される時間（秒単位）（テストランの状態取得時点）。

    パラメータの値が`null`になる場合は：
    
    * まだ脆弱性のチェックが進行中でない場合（例えば、新しく作成されたテストランにはまだベースラインリクエストが記録されていない）。
    * テストランが実行中でない場合（つまり、 `"state":"running"`以外の状態にある）。

    `estimated_time_to_completion`パラメータの値は、*(`planing_requests_count`/`current_rps`)*として計算されます。

!!! warning "テストランの実行速度と時間推定に関連するパラメータの可能な値"
    上記のパラメータ値は、テストランの実行開始から初めて10秒間は`null`です。

`estimated_time_to_completion`パラメータの値を使用して、次にテストランの状態を確認する時間を決定できます。この値は増減する可能性があります。

**例：**

`estimated_time_to_completion`期間だけテストランの状態を確認するには、以下の手順を行ってください：

1. テストランの実行が始まった後、何度かテストランの状態を取得します。例えば、10秒間隔で行うことができます。`estimated_time_to_completion`パラメータの値が`null`以外になるまで続けます。

2. `estimated_time_to_completion`秒後に次のテストランの状態の確認を行います。

3. 前の手順をテストランの実行が完了するまで繰り返します。

!!! info "推定値のグラフ表示"
    WallarmのWebインターフェースを使用しても推定値を取得することができます。
    
    そのためには、Wallarmポータルにログインし、現在実行中の[テストランのリスト][link-wl-portal-testruns-in-progress]に移動します：
    
    ![テストランの速度と実行時間の推定][img-testrun-velocity]
    
    テストランの実行が完了すると、平均リクエスト毎秒の値が表示されます：
    
    ![平均リクエスト毎秒値][img-testrun-avg-rps]
