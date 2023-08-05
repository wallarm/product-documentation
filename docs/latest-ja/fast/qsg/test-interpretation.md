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

この章では、[My Wallarmポータル][link-wl-console]のテスト結果解釈ツールの概要を提供します。この章を終えると、[前章][link-previous-chapter]で発見されたXSS脆弱性についての追加情報を得ることができます。

1.  "ダッシュボード → FAST"タブをクリックして、現状をすばやく確認します。ダッシュボードには、すべてのテストの実行とそのステータス、選択した期間の脆弱性数の概要が表示されます。

    ![!Dashboard][img-dashboard]

    <!-- イベント検索ツールも利用できます。 ”イベント”タブを選択して必要なリクエストを検索ボックスに入力します。検索ボックスの近くにある “How to search” のリンクからヘルプを得ることができます。 -->

    <!-- 検索ツールの使用方法についての詳細は、[link][link-how-to-search]を参照してください。 -->

2.  ”テスト実行”タブを選択すると、すべてのテスト実行のリストと各個の簡単な情報を見ることができます：

    * テスト実行のステータス (進行中、成功、または失敗)
    * ベースラインリクエストの録音が進行中であるかどうか
    * 何件のベースラインリクエストが記録されたか
    * 何の脆弱性が見つかったか (もし見つかった場合)
    * ターゲットアプリケーションのドメイン名
    * テスト生成と実行プロセスがどこで行われたか (ノードまたはクラウド)

    ![!テスト実行][img-testrun]

3.  テストの実行を詳しく確認するためにそれをクリックします：

    ![!テストの詳細][img-test-run-expanded]

    テストの詳細から以下の情報を取得できます：

    * 処理されたベースラインリクエストの数
    * テスト実行の作成日
    * テスト実行の持続期間
    * ターゲットアプリケーションに送信されたリクエストの数
    * ベースラインリクエストテストプロセスのステータス：

        * **成功** ![!Status: Passed][img-status-passed]
        
            与えられたベースラインリクエストに対して、脆弱性は見つかりませんでした（選択したテストポリシーによります - 別のものを選択すれば、脆弱性が見つかるかもしれません）または、テストポリシーがリクエストに適用可能ではありません。
        
        * **失敗** ![!Status: Failed][img-status-failed]  
        
            与えられたベースラインリクエストについて、脆弱性が見つかりました。
            
        * **進行中** ![!Status: In progress][img-status-inprogress]
              
            ベースラインリクエストが脆弱性のテスト中です。
            
        * **エラー** ![!Status: Error][img-status-error]  
            
            エラーが原因でテストプロセスが停止しました。
            
        * **待機中** ![!Status: Waiting][img-status-waiting]      
        
            ベースラインリクエストがテストのためにキューに入れられています。同時にテストできるのは、制限された数のリクエストだけです。
            
        * **中断** ![!Status: Interrupted][img-status-interrupted]
        
            テストプロセスは手動で中断された（「アクション」→「中断」）、または同じFASTノードで別のテストが実行されました。

4.  ベースラインリクエストを詳しく確認するためにそれをクリックします：

    ![!テストの詳細][img-testrun-expanded]
    
    各個のベースラインリクエストには以下の情報が提供されます：

    * 作成時間
    * ターゲットアプリケーションに生成され送信されたテストリクエストの数
    * 使用中のテストポリシー
    * リクエスト処理のステータス

5.  リクエスト処理の完全なログを表示するには、最も右側にある”詳細”リンクを選択します：

    ![!リクエスト処理ログ][img-log]

6.  発見された脆弱性の概要を得るには、”問題”リンクをクリックします：

    ![!脆弱性の簡単な説明][img-vuln-description]

    脆弱性を詳しく確認するために、脆弱性の説明をクリックします：

    ![!脆弱性の詳細][img-vuln-details]
            
テスト結果を解釈するツールを理解するべきです。