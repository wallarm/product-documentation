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

本章では[My Wallarm portal][link-wl-console]上のテスト結果解釈ツールの概要を説明します。本章を完了すると、[previous chapter][link-previous-chapter]で検出されたXSS脆弱性に関する追加情報が得られます。

1. "Dashboards → FAST"タブをクリックして現在の状況を素早く確認します。ダッシュボードは、指定した期間内のすべてのテストランとその状態の概要および脆弱性の件数を表示します。

   ![ダッシュボード][img-dashboard]

   <!-- イベント検索ツールも使用できます。その場合、“Events”タブを選択し、検索ボックスに必要なリクエストを入力します。ヘルプは検索ボックス近くにある“How to search”リンクから参照できます。   -->

   <!-- 検索ツールの使用方法の詳細については、[link][link-how-to-search]を参照してください。 -->

2. "Test runs"タブを選択すると、各テストランに関する簡単な情報とともに、すべてのテストランの一覧が表示されます。例として、次の情報が含まれます：

   * テストランの状態（進行中、成功、または失敗）
   * ベースラインリクエストの記録が進行中かどうか
   * 記録されたベースラインリクエストの数
   * 発見された脆弱性（ある場合）
   * 対象アプリケーションのドメイン名
   * テスト生成および実行プロセスが実施された場所（nodeまたはcloud）

   ![テストラン][img-testrun]

3. テストランを詳細に確認するには、それをクリックします：

   ![展開されたテストラン][img-test-run-expanded]

   展開されたテストランからは、以下の情報を取得できます：

   * 処理されたベースラインリクエストの数
   * テストランの作成日時
   * テストランの実行時間
   * 対象アプリケーションに送信されたリクエストの数
   * ベースラインリクエストのテストプロセスの状態：

       * **Passed** ![Status: Passed][img-status-passed]
       
           対象のベースラインリクエストに対して脆弱性が検出されなかった（選択されたテストポリシーによります。別のポリシーを選択した場合、脆弱性が検出される可能性があります）またはテストポリシーが該当しない場合です。
       
       * **Failed** ![Status: Failed][img-status-failed]  
       
           対象のベースラインリクエストに対して脆弱性が検出されました。
            
       * **In progress** ![Status: In progress][img-status-inprogress]
              
           ベースラインリクエストに対する脆弱性テストが実施中です。
            
       * **Error** ![Status: Error][img-status-error]  
            
           エラーによりテストプロセスが停止されました。
            
       * **Waiting** ![Status: Waiting][img-status-waiting]      
        
           ベースラインリクエストはテスト待ちのキューに追加されています。同時にテストできるリクエストの数は限られています。
            
       * **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
           テストプロセスは手動で中断された（「Actions」→「Interrupt」）か、同じFASTノード上で別のテストランが実行されたため中断されました。

4. ベースラインリクエストを詳細に確認するには、クリックします：

   ![展開されたテストラン][img-testrun-expanded]
    
   各ベースラインリクエストごとに、以下の情報が提供されます：

   * 作成日時
   * 生成され対象アプリケーションに送信されたテストリクエストの数
   * 使用中のテストポリシー
   * リクエスト処理の状態

5. リクエスト処理の完全なログを表示するには、右端の「Details」リンクを選択します：

   ![リクエスト処理ログ][img-log]

6. 検出された脆弱性の概要を確認するには、「Issue」リンクをクリックします：

   ![脆弱性の概要説明][img-vuln-description]

   脆弱性を詳細に確認するには、脆弱性の説明をクリックします：

   ![脆弱性の詳細][img-vuln-details]
            
これで、テスト結果の解釈に役立つツールに精通できたと思います。