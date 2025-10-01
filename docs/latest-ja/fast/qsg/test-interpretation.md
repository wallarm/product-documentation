[img-dashboard]:            ../../images/fast/qsg/common/test-interpretation/25-qsg-fast-test-int-dashboard.png
[img-testrun]:              ../../images/fast/qsg/common/test-interpretation/27-qsg-fast-test-int-testrun-screen.png
[img-test-run-expanded]:    ../../images/fast/qsg/common/test-interpretation/28-qsg-fast-testrun-opened.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-testrun-expanded]:     ../../images/fast/qsg/common/test-interpretation/29-qsg-fast-test-int-testrun-expanded.png
[img-log]:                  ../../images/fast/qsg/common/test-interpretation/30-qsg-fast-test-int-testrun-log.png
[img-vuln-description]:     ../../images/fast/qsg/common/test-interpretation/31-qsg-fast-test-int-events-vuln-description.png     
[img-vuln-details]:         ../../images/fast/qsg/common/test-interpretation/32-qsg-fast-int-issue-details.png

[link-previous-chapter]:    test-run.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-how-to-search]:       https://docs.wallarm.com/en/user-en/use-search-en.html    

    
    
# テスト結果の解釈

この章では、[My Wallarm portal][link-wl-console]上でテスト結果を解釈するためのツールの概要を説明します。この章を終えると、[前の章][link-previous-chapter]で検出されたXSS脆弱性に関する追加情報を得られます。

1. 「Dashboards → FAST」タブをクリックして、状況をざっと確認します。ダッシュボードでは、すべてのテスト実行とそのステータスの概要に加えて、選択した期間の脆弱性件数が表示されます。

    ![ダッシュボード][img-dashboard]

    <!-- You can use an event search tool as well. To do that, select the “Events” tab, and enter the necessary request into the search box. Help is available through the link “How to search”, which is located near the search box.   -->

    <!-- See the [link][link-how-to-search] for more information about using the search tool. -->

2. 「Test runs」タブを選択すると、すべてのテスト実行の一覧と、各テスト実行に関する次のような簡単な情報を確認できます。

    * テスト実行のステータス（進行中、成功、失敗）
    * ベースラインリクエストの記録が進行中かどうか
    * 記録されたベースラインリクエストの数
    * 検出された脆弱性（ある場合）
    * 対象アプリケーションのドメイン名
    * テストの生成および実行が行われた場所（ノードまたはクラウド）

    ![テスト実行][img-testrun]

3. テスト実行をクリックして詳細を確認します。

    ![展開されたテスト実行][img-test-run-expanded]

    展開されたテスト実行からは、次の情報を確認できます。

    * 処理済みベースラインリクエスト数
    * テスト実行の作成日時
    * テスト実行の継続時間
    * 対象アプリケーションに送信されたリクエスト数
    * ベースラインリクエストのテスト処理のステータス:

        * **Passed** ![Status: Passed][img-status-passed]
        
            該当のベースラインリクエストに対しては脆弱性が見つかりませんでした（これは選択したテストポリシーに依存します。別のポリシーを選択すると脆弱性が見つかる可能性があります）。あるいは、そのリクエストにテストポリシーが適用できません。
        
        * **Failed** ![Status: Failed][img-status-failed]  
        
            該当のベースラインリクエストで脆弱性が検出されました。
            
        * **In progress** ![Status: In progress][img-status-inprogress]
              
            ベースラインリクエストの脆弱性テストを実行中です。
            
        * **Error** ![Status: Error][img-status-error]  
            
            エラーによりテスト処理が停止しました。
            
        * **Waiting** ![Status: Waiting][img-status-waiting]      
        
            ベースラインリクエストがテスト待ちのキューに入りました。同時にテストできるリクエスト数には上限があります。 
            
        * **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
            テスト処理が手動で中断されました（「Actions」→「Interrupt」）、または同じFASTノードで別のテスト実行が実行されました。   

4. ベースラインリクエストをクリックして詳細を確認します。

    ![展開されたテスト実行][img-testrun-expanded]
    
    各ベースラインリクエストについて、次の情報が表示されます。

    * 作成時刻
    * 対象アプリケーションに生成・送信されたテストリクエスト数
    * 使用中のテストポリシー
    * リクエスト処理のステータス

5. リクエスト処理の完全なログを表示するには、右端の「Details」リンクを選択します。

    ![リクエスト処理のログ][img-log]

6. 検出された脆弱性の概要を確認するには、「Issue」リンクをクリックします。

    ![脆弱性の概要][img-vuln-description]

    脆弱性の詳細を確認するには、脆弱性の説明をクリックします。

    ![脆弱性の詳細][img-vuln-details]
            
これで、テスト結果の解釈に役立つツールを把握できたはずです。