[doc-about-tr-token]:   internals.md

[img-testrun-velocity]: ../../images/fast/poc/en/checking-testrun-status/testrun-velocity.png
[img-testrun-avg-rps]:  ../../images/fast/poc/en/checking-testrun-status/testrun-avg-rps.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-test-runs]:            ../../images/fast/poc/en/checking-testrun-status/test-runs.png

[link-wl-portal-testruns-in-progress]:  https://us1.my.wallarm.com/testing/?status=running

[link-integration-chapter]:         integration-overview.md
[link-vuln-list]:                   ../vuln-list.md

[anchor-testrun-estimates]:         #estimates-of-test-runs-execution-speed-and-time-to-completion

[doc-testrun-copying]:              copy-testrun.md
[doc-stop-recording]:               stop-recording.md


#   テスト実行の状態確認

最初のベースラインリクエストが記録されると、テストリクエストの生成と実行の処理が開始されます。ベースラインリクエストの記録プロセスを[停止][doc-stop-recording]した後も、これらの処理はしばらくの間継続する場合があります。進行中の処理の状況を把握するために、テスト実行の状態を確認できます。これには、以下の方法を使用できます:

* [Wallarm UIで状態を確認する](#checking-the-state-via-wallarm-ui)
* [APIメソッドで状態を確認する](#checking-the-state-using-api-method)

## Wallarm UIで状態を確認する

テスト実行の状態はWallarm UIでリアルタイムに表示されます。状態を確認するには:

1. [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmアカウントにログインします。
2. **Test runs**セクションを開き、対象のテスト実行をクリックします。

![テスト実行の例][img-test-runs]

状態は各ベースラインリクエストごとに表示されます:

* **Passed** ![ステータス: Passed][img-status-passed]
        
    該当のベースラインリクエストに対して脆弱性は検出されませんでした。
        
* **In progress** ![ステータス: In progress][img-status-inprogress]
              
    ベースラインリクエストに対する脆弱性テストを実行中です。

* **Failed** ![ステータス: Failed][img-status-failed]  
        
    該当のベースラインリクエストに対して脆弱性が検出されました。各ベースラインリクエストごとに、脆弱性の件数と詳細へのリンクが表示されます。
            
* **Error** ![ステータス: Error][img-status-error]  
            
    表示されたエラーによりテスト処理が停止しました:

    * `Connection failed`: ネットワークエラー
    * `Auth failed`: 認証パラメータが渡されていない、または不正です
    * `Invalid policies`: 設定済みのテストポリシーの適用に失敗しました
    * `Internal exception`: セキュリティテストの設定が不正です
    * `Recording error`: リクエストパラメータが不正、または不足しています

* **Waiting** ![ステータス: Waiting][img-status-waiting]      
        
    ベースラインリクエストはテスト待ちのキューに入っています。同時にテストできるリクエスト数には制限があります。 
            
* **Interrupted** ![ステータス: Interrupted][img-status-interrupted]
        
    **Interrupt testing**ボタンによってテスト処理が中断されたか、同じFASTノードで別のテスト実行が実行されました。

## APIメソッドで状態を確認する

!!! info "必要なデータ"
    以下の手順に進むには、次のデータが必要です:
    
    * トークン
    * テスト実行の識別子
    
    テスト実行とトークンの詳細は[こちら][doc-about-tr-token]をご参照ください。
    
    本ドキュメントでは、例として以下の値を使用します:

    * トークンとして`token_Qwe12345`
    * テスト実行の識別子として`tr_1234`


!!! info "テスト実行の確認に適したタイミングの選び方"
    あらかじめ定めた期間(例:15秒)でテスト実行の状態を確認できます。あるいは、テスト実行の完了推定時間を用いて、次の確認タイミングを決めることもできます。この推定値はテスト実行の状態確認時に取得できます。[詳細はこちらをご覧ください。][anchor-testrun-estimates]

テスト実行の状態を単発で確認するには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id` にGETリクエストを送信します:

--8<-- "../include/fast/operations/api-check-testrun-status.md"

APIサーバへのリクエストが成功すると、サーバのレスポンスが返されます。レスポンスには多くの有用な情報が含まれており、例えば以下のとおりです:

* `vulns`: 対象アプリケーションで検出された脆弱性に関する情報を含む配列です。各脆弱性レコードには、当該脆弱性に関して次のデータが含まれます:
    * `id`: 脆弱性の識別子。
    
    * `threat`: 1〜100の範囲の数値で、脆弱性の脅威レベルを表します。値が大きいほど深刻度が高くなります。
    * `code`: 脆弱性に割り当てられたコード。

    * `type`: 脆弱性の種類。このパラメータは[こちら][link-vuln-list]で説明されている値のいずれかを取ります。
    
* `state`: テスト実行の状態。このパラメータは次のいずれかの値を取ります:
    * `cloning`: ベースラインリクエストのクローンを作成中(テスト実行の[コピー作成][doc-testrun-copying]時)。
    * `running`: テスト実行が稼働中。
    * `paused`: テスト実行が一時停止中。
    * `interrupted`: テスト実行が中断されました(例:このFASTノードが現在のテスト実行を実行中に、同ノードで新しいテスト実行が作成された場合)。
    * `passed`: テスト実行が正常に完了しました(脆弱性は検出されませんでした)。
    * `failed`: テスト実行が失敗として完了しました(脆弱性が検出されました)。
    
* `baseline_check_all_terminated_count`: すべてのテストリクエストチェックが完了したベースラインリクエストの数。
    
* `baseline_check_fail_count`: 一部のテストリクエストチェックが失敗したベースラインリクエストの数(言い換えると、FASTが脆弱性を検出した)。
    
* `baseline_check_tech_fail_count`: 技術的な問題により一部のテストリクエストチェックが失敗したベースラインリクエストの数(例:対象アプリケーションが一定期間利用できなかった場合)。
    
* `baseline_check_passed_count`: すべてのテストリクエストチェックに合格したベースラインリクエストの数(言い換えると、FASTは脆弱性を検出しなかった)。 
    
* `baseline_check_running_count`: テストリクエストチェックを実行中のベースラインリクエストの数。
    
* `baseline_check_interrupted_count`: すべてのテストリクエストチェックが中断されたベースラインリクエストの数(例:テスト実行の中断による)。
    
* `sended_requests_count`: 対象アプリケーションに送信されたテストリクエストの総数。
    
* `start_time` and `end_time`: テスト実行の開始時刻と終了時刻。それぞれUNIX時間形式で指定されます。
    
* `domains`: ベースラインリクエストの宛先となった対象アプリケーションのドメイン名の一覧。 
    
* `baseline_count`: 記録されたベースラインリクエストの数。
    
* `baseline_check_waiting_count`: チェック待ちのベースラインリクエストの数。

* `planing_requests_count`: 対象アプリケーションに送信待ちのテストリクエストの総数。

###  テスト実行の処理速度と完了までの推定時間

APIサーバのレスポンスには、テスト実行の処理速度と完了までの時間を見積もるための別グループのパラメータが含まれます。このグループには次のパラメータが含まれます:

* `current_rps`—テスト実行の状態を取得した瞬間に、FASTが対象アプリケーションへリクエストを送信している現在の速度。

    この値は平均RPSです。この平均RPSは、テスト実行の状態を取得する直前10秒間に、FASTが対象アプリケーションへ送信したリクエスト数に基づいて算出されます。 

    **例:**
    テスト実行の状態を12:03:01に取得した場合、`current_rps`パラメータの値は*(12:02:51-12:03:01の時間帯に送信されたリクエスト数)/10*として計算されます。

* `avg_rps`—テスト実行の状態を取得した時点における、FASTが対象アプリケーションへリクエストを送信している平均速度。

    この値は、テスト実行の全期間においてFASTが対象アプリケーションへ送信した1秒あたりの平均リクエスト数(RPS)です:

    * テスト実行がまだ進行中の場合: テスト実行の開始から現在時刻まで(これは`current time`-`start_time`に等しい)。
    * テスト実行が完了している場合: テスト実行の開始から終了まで(これは`end_time`-`start_time`に等しい)。

        `avg_rps`パラメータの値は*(`sended_requests_count`/(テスト実行の全実行時間))*として計算されます。
    
* `estimated_time_to_completion`—テスト実行の状態を取得した時点から、テスト実行が完了するまでにかかると見込まれる時間(秒)。 

    次の場合、このパラメータの値は`null`です:
    
    * まだ脆弱性チェックが開始されていない(例:新規に作成したテスト実行にベースラインリクエストがまだ記録されていない)。
    * テスト実行が実行中でない(すなわち、"state":"running"以外の状態にある)。

    `estimated_time_to_completion`パラメータの値は*(`planing_requests_count`/`current_rps`)*として計算されます。
    
!!! warning "テスト実行の処理速度と時間の推定に関連するパラメータの取りうる値について"
    上記のパラメータの値は、テスト実行の開始から最初の10秒間は`null`です。

`estimated_time_to_completion`パラメータの値を用いて、次回のテスト実行の状態確認タイミングを決めることができます。この値は増加する場合も減少する場合もある点にご注意ください。

**例:**

`estimated_time_to_completion`で示された時間が経過したタイミングでテスト実行の状態を確認するには、次の手順を実施します:

1.  テスト実行の開始後、テスト実行の状態を複数回取得します。例えば10秒間隔で取得します。`estimated_time_to_completion`パラメータの値が`null`でなくなるまで続けます。

2.  次の状態確認は、`estimated_time_to_completion`秒後に実施します。

3.  テスト実行が完了するまで、前の手順を繰り返します。

!!! info "推定値のグラフィカル表示"
    WallarmのWebインターフェイスでも推定値を取得できます。
    
    そのためには、Wallarmポータルにログインし、現在実行中の[テスト実行の一覧][link-wl-portal-testruns-in-progress]に移動します:
    
    ![テスト実行の速度と実行時間の推定値][img-testrun-velocity]
    
    テスト実行が完了すると、1秒あたりの平均リクエスト数が表示されます:
    
    ![1秒あたりの平均リクエスト数][img-testrun-avg-rps]