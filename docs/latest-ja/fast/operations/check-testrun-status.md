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

# テスト実行状態の確認

テストリクエストの作成および実行のプロセスは、最初のベースラインリクエストが記録された時点で開始され、ベースラインリクエストの記録が[停止されました][doc-stop-recording]後も相当な時間続く可能性があります。テスト実行の状態を確認することで、実行プロセスの状況を把握することができます。これには、次の方法を利用します:

* [Wallarm UI経由での状態確認](#checking-the-state-via-wallarm-ui)
* [APIメソッドを使用した状態確認](#checking-the-state-using-api-method)

## Wallarm UI経由での状態確認

テスト実行の状態はWallarm UI上でリアルタイムに表示されます。状態を確認するには:

1. [US cloud](https://us1.my.wallarm.com/)または[EU cloud](https://my.wallarm.com/)でWallarmアカウントにログインします。
2. **Test runs**セクションを開き、必要なテスト実行をクリックします。

![テスト実行例][img-test-runs]

各ベースラインリクエストごとに状態が表示されます:

* **Passed** ![Status: Passed][img-status-passed]  
    指定されたベースラインリクエストに対して脆弱性が見つかりませんでした。
        
* **In progress** ![Status: In progress][img-status-inprogress]  
    ベースラインリクエストは脆弱性検査中です。
              
* **Failed** ![Status: Failed][img-status-failed]  
    指定されたベースラインリクエストに対して脆弱性が見つかりました。各ベースラインリクエストごとに脆弱性の数および詳細へのリンクが表示されます。
            
* **Error** ![Status: Error][img-status-error]  
    表示されたエラーのためにテストプロセスが停止されました:

    * `Connection failed`: ネットワークエラー
    * `Auth failed`: 認証パラメータが渡されなかったか、正しく渡されませんでした
    * `Invalid policies`: 設定されたテストポリシーの適用に失敗しました
    * `Internal exception`: セキュリティテストの設定が正しくありません
    * `Recording error`: リクエストパラメータが不正または欠落しています

* **Waiting** ![Status: Waiting][img-status-waiting]      
    ベースラインリクエストはテスト待ちのキューに入っています。同時にテストできるリクエスト数は限られています。
            
* **Interrupted** ![Status: Interrupted][img-status-interrupted]  
    テストプロセスは**Interrupt testing**ボタンによって中断されたか、同一FASTノードで別のテスト実行が実施されたため中断されました。

## APIメソッドを使用した状態確認

!!! info "必要なデータ"
    以下の手順を進めるために、次のデータが必要です:
    
    * トークン
    * テスト実行識別子
    
    テスト実行およびトークンに関する詳細情報は[こちら][doc-about-tr-token]を参照してください。
    
    本書では次の値がサンプル値として使用されています:
    
    * `token_Qwe12345` はトークンとして使用されます。
    * `tr_1234` はテスト実行の識別子として使用されます。

!!! info "テスト実行の状態確認を行う適切な時間間隔の選定方法"
    テスト実行の状態は、定義済みの時間間隔（例:15秒）で確認することができます。あるいは、テスト実行の完了予測時間の推定値を利用して、次の確認のタイミングを決定することも可能です。この推定値は、テスト実行の状態確認時に取得できます。[詳細は以下を参照してください。][anchor-testrun-estimates]

テスト実行の状態を1回確認するには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id` にGETリクエストを送信します:

--8<-- "../include/fast/operations/api-check-testrun-status.md"

APIサーバーへのリクエストが成功すると、サーバーからのレスポンスが返されます。このレスポンスには、以下を含む多くの有用な情報が含まれています:

* `vulns`: 対象アプリケーションに検出された脆弱性に関する情報を含む配列です。各脆弱性レコードには、該当する脆弱性に関する以下のデータが含まれています:
    * `id`: 脆弱性の識別子です。
    
    * `threat`: 脆弱性の危険度を示す1から100までの数値です。数値が高いほど、脆弱性の重大度が高いことを意味します。
    * `code`: 脆弱性に割り当てられたコードです。

    * `type`: 脆弱性の種類です。このパラメータは[こちら][link-vuln-list]に記載されている値のいずれかとなります。
    
* `state`: テスト実行の状態です。このパラメータは以下の値のいずれかとなります:
    * `cloning`: テスト実行の[コピー作成][doc-testrun-copying]時にベースラインリクエストのクローン作成が進行中です。
    * `running`: テスト実行が実施中です。
    * `paused`: テスト実行が一時停止中です。
    * `interrupted`: テスト実行が中断されました（例:当該FASTノードで現在のテスト実行中に新たなテスト実行が作成された場合）。
    * `passed`: テスト実行が正常に完了しました（脆弱性が見つかりませんでした）。
    * `failed`: テスト実行が失敗により完了しました（一部脆弱性が見つかりました）。
    
* `baseline_check_all_terminated_count`: 全てのテストリクエストチェックが完了したベースラインリクエストの数です。
    
* `baseline_check_fail_count`: いくつかのテストリクエストチェックが失敗したベースラインリクエストの数です（つまり、FASTが脆弱性を検出しました）。
    
* `baseline_check_tech_fail_count`: 技術的な問題により一部テストリクエストチェックが失敗したベースラインリクエストの数です（例:対象アプリケーションが一時的に利用できなかった場合）。
    
* `baseline_check_passed_count`: 全てのテストリクエストチェックが合格したベースラインリクエストの数です（つまり、FASTが脆弱性を検出しませんでした）。
    
* `baseline_check_running_count`: テストリクエストチェックが進行中のベースラインリクエストの数です。
    
* `baseline_check_interrupted_count`: すべてのテストリクエストチェックが中断されたベースラインリクエストの数です（例:テスト実行が中断された場合）。
    
* `sended_requests_count`: 対象アプリケーションに送信されたテストリクエストの総数です。
    
* `start_time`および`end_time`: テスト実行が開始および終了した時刻です。時刻はUNIXタイムフォーマットで指定されます。
    
* `domains`: ベースラインリクエストの送信対象となった対象アプリケーションのドメイン名の一覧です。
    
* `baseline_count`: 記録されたベースラインリクエストの数です。
    
* `baseline_check_waiting_count`: チェック待ちのベースラインリクエストの数です;

* `planing_requests_count`: 対象アプリケーションに送信される予定のテストリクエストの総数です。

### テスト実行の速度および完了予測時間の推定値

APIサーバーのレスポンスには、テスト実行の速度および完了予測時間を推定するための一連のパラメータがあります。このグループには以下のパラメータが含まれます:

* `current_rps`—テスト実行の状態取得時点でFASTが対象アプリケーションに送信する現在のリクエスト送信速度です（1秒あたりのリクエスト数）。  
    この値は、テスト実行の状態取得直前の10秒間にFASTが対象アプリケーションに送信したリクエスト数の平均値として計算されます。 

    **例:**  
    テスト実行の状態が12:03:01に取得された場合、`current_rps`の値は（[12:02:51-12:03:01]の間に送信されたリクエスト数）/10として計算されます。

* `avg_rps`—テスト実行の状態取得時点でFASTが対象アプリケーションに送信したリクエストの平均速度（1秒あたりのリクエスト数）です。  
    この値は、テスト実行の全実行時間中にFASTが対象アプリケーションに送信したリクエスト数の平均値として計算されます:
    
    * テスト実行が実行中の場合は、テスト実行開始から現在までの時間（`current time`-`start_time`に相当）。
    * テスト実行が完了している場合は、テスト実行開始から終了までの時間（`end_time`-`start_time`に相当）。
    
    `avg_rps`の値は、*(`sended_requests_count`/（テスト実行の全実行時間）)*として計算されます。
    
* `estimated_time_to_completion`—テスト実行の状態取得時点で、テスト実行が完了するまでに要する推定時間（秒単位）です。  
    パラメータの値が`null`の場合:
    
    * 脆弱性チェックが進行中でない場合（例:新規作成されたテスト実行にまだベースラインリクエストが記録されていない）。
    * テスト実行が実行中でない場合（すなわち、`"state":"running"`以外の状態）。
    
    `estimated_time_to_completion`の値は、*(`planing_requests_count`/`current_rps`)*として計算されます。
    
!!! warning "テスト実行の速度および完了予測時間に関連するパラメータの可能な値"
    上記のパラメータの値は、テスト実行開始後最初の10秒間は`null`となります。

次のテスト実行の状態確認のタイミングは、`estimated_time_to_completion`パラメータの値を利用して決定することができます。なお、値は増加または減少する可能性があります。

**例:**

テスト実行の状態を`estimated_time_to_completion`の時間間隔後に確認するには、次の手順を行います:

1. テスト実行の開始後、テスト実行の状態を数回取得します。例えば、10秒間隔で実施します。`estimated_time_to_completion`パラメータの値が`null`でなくなるまでこの手順を継続します。
2. `estimated_time_to_completion`秒後に次回の状態確認を行います。
3. テスト実行が完了するまで、前記の手順を繰り返します。

!!! info "推定値のグラフィカルな表現"
    Wallarmのウェブインターフェースを利用して推定値を確認することもできます。
    
    そのために、Wallarmポータルにログインし、現在実行中の[test runs][link-wl-portal-testruns-in-progress]一覧に移動します:
    
    ![テスト実行の速度および実行時間の推定値][img-testrun-velocity]
    
    テスト実行が完了すると、1秒あたりの平均リクエスト数が表示されます:
    
    ![1秒あたりの平均リクエスト数][img-testrun-avg-rps]