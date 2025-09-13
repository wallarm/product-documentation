[img-quick-help-howto]:     ../../images/fast/onboarding/common/1-quick-help.png
[img-fast-5mins-button]:    ../../images/fast/onboarding/common/2-fast-in-5mins.png
[img-intro]:                ../../images/fast/onboarding/common/3-intro.png
[img-deploy]:               ../../images/fast/onboarding/common/4-deploy.png
[img-cont-deployed]:        ../../images/fast/onboarding/common/5-cont-deployed.png
[img-ff-proxy-settings]:    ../../images/fast/onboarding/common/6-ff-proxy.png
[img-create-testrun]:       ../../images/fast/onboarding/common/7-create-testrun.png
[img-recording]:            ../../images/fast/onboarding/common/8-check-recording.png
[img-http-request]:         ../../images/fast/onboarding/common/9-request.png
[img-gruyere-app]:          ../../images/fast/onboarding/common/10-gruyere-app.png
[img-stop-recording]:       ../../images/fast/onboarding/common/11-stop-recording.png
[img-results]:              ../../images/fast/onboarding/common/12-detected-vuln.png
[img-detailed-results]:     ../../images/fast/onboarding/common/13-vuln-details.png
[img-finish]:               ../../images/fast/onboarding/common/14-finish.png

[link-wl-portal]:           https://us1.my.wallarm.com
[link-docker-install-docs]: https://docs.docker.com/install/overview/
[link-firefox-proxy]:       https://support.mozilla.org/en-US/kb/connection-settings-firefox
[link-gruyere-app]:         http://google-gruyere.appspot.com/
[link-qsg]:                 ../qsg/deployment-options.md

#   FASTのオンボーディング

--8<-- "../include/fast/cloud-note.md"

 最初に[Wallarm portal][link-wl-portal]へログインした際、5つのステップからなるオンボーディングプロセスを通じてFASTに慣れることができます。

!!! info "オンボーディングプロセスの制御"
    オンボーディングパネルの✕ボタンをいつでもクリックして、オンボーディングプロセスを停止できます。
    
    オンボーディングを完全にスキップするか、現在のステップから後で再開するかを選択できます。
    
    オンボーディングをスキップ後に開始したい場合は、Wallarm portalの右上にあるクエスチョンマークを押し、開いたサイドバーで「FAST in 5 minutes」項目を選択します:            
    
    ![「The Quick Help」ボタン][img-quick-help-howto]
    
    以前に保留したオンボーディングプロセスを再開する場合は、Wallarm portalの右下にある「FAST in 5 minutes」ボタンをクリックします:
    
    ![「FAST in 5 minutes」ボタン][img-fast-5mins-button]

FASTを手早く理解するには、次の手順に従います。
1.  FASTソリューションについて説明を読みます。
    
    ![FASTソリューションに関する概要情報][img-intro]
    
    次のステップに進むには「Deploy FAST Node →」ボタンをクリックします。
    
2.  お使いのマシンにFASTノードを含むDockerコンテナをデプロイします。そのために、このステップに表示される`docker run`コマンドをコピーして実行します。コマンドには必要なパラメータがすべてあらかじめ設定されています。
    
    ![デプロイのヒント][img-deploy]
    
    !!! info "Dockerのインストール"
        Dockerがない場合は、[インストールしてください][link-docker-install-docs]。Dockerのエディションはどちらでも適しています。Community EditionでもEnterprise Editionでも問題ありません。
    
    FASTノードは起動後、`127.0.0.1:8080`で受信接続を待ち受けます。
    
    ![デプロイ済みのFASTノード][img-cont-deployed]

    お使いのマシンのブラウザを、HTTPプロキシとして`127.0.0.1:8080`を使用するように設定します。Wallarm portalを開いているブラウザ以外であれば、どのブラウザでも使用できます。Mozilla Firefoxを推奨します（プロキシの設定方法は[こちらの手順][link-firefox-proxy]を参照してください）。
    
    ![Mozilla Firefoxのプロキシ設定][img-ff-proxy-settings]
    
    !!! info "別のポート番号を使用する"
        FASTノードに`8080`ポートを割り当てたくない場合（例: そのポートで別のサービスが待ち受けている場合）、FASTで使用する別のポート番号を設定できます。そのためには、`docker run`コマンドの`-p`パラメータで希望するポート番号を指定します。例えば、ポート`9090`を使用する場合は次のように指定します: `-p 9090:8080`。
    
    次のステップに進むには「Create a Test Run →」ボタンをクリックします。
    
    !!! info "前のステップに戻る"
        前のステップ名が付いたボタン（例: 「← Understanding FAST」）をクリックすれば、いつでも前のステップに戻れることにご注意ください。
   
3.  「Create test run」ボタンをクリックしてテストランを作成します。オンボーディングのヒントに従い、テストラン名を入力し、ドロップダウンリストから必要なテストポリシーとノードを選択します:

    ![テストランの作成][img-create-testrun]
    
    「Create and run」ボタンを押して、テストランの作成を完了します。
    
    次のステップに進むには「Discover Vulnerabilities →」ボタンをクリックします。
    
4.  FASTノードのコンソールに`Recording baselines for TestRun...`というメッセージが表示されていることを確認します:
    
    ![FASTノードのコンソール][img-recording]
    
    次に、脆弱なアプリケーション[Google Gruyere][link-gruyere-app]にリクエストを送信し、FASTによる脆弱性テストを開始します。
    
    そのために、オンボーディングのヒントに記載されているHTTPリクエストをコピーし、先ほどFASTノードをプロキシとして使用するよう設定したブラウザのアドレスバーに貼り付けて、リクエストを実行します:
    
    ![ヒント内のHTTPリクエスト][img-http-request]
    
    ![HTTPリクエストの実行][img-gruyere-app]
    
    リクエスト送信後、「Actions」ドロップダウンメニューから「Stop recording」を選択してリクエストの記録を停止します。「Yes」ボタンを押して操作を確定します:
    
    ![リクエスト記録プロセスの停止][img-stop-recording]
    
    テストが完了するまで待ちます。FASTはGoogle GruyereアプリケーションでXSS脆弱性を検出するはずです。テストランの「Results」列に脆弱性の識別子と種類が表示されます:
    
    ![テスト結果][img-results]
    
    !!! info "脆弱性の分析"
        テストランの「Results」列の値をクリックすると、検出された脆弱性の詳細を確認できます:
        
        ![脆弱性の詳細情報][img-detailed-results]
    
    次のステップに進むには「Run With It!」ボタンをクリックします。
    
5.  ここまでで、FASTに習熟し、Webアプリケーションの脆弱性を1件発見できました。
    
    ![オンボーディングプロセスの終了][img-finish]
    
    FASTの始め方に関する詳細は[「クイックスタートガイド」][link-qsg]を参照してください。
    
    「Finish」ボタンをクリックしてオンボーディングプロセスを完了します。
    
    !!! info "追加で実施できる操作"
        脆弱性が正常に検出されたら、FASTノードのDockerコンテナを停止し、ブラウザのプロキシ設定を無効にできます。