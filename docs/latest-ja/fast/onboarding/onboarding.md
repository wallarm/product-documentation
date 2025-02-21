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

# FAST Onboarding

--8<-- "../include/fast/cloud-note.md"

最初に[Wallarm portal][link-wl-portal]にログインした際、５段階のオンボーディングプロセスを通してFASTに習熟する機会が提供されます。

!!! info "オンボーディングプロセスの制御"
    オンボーディングパネル内の✕ボタンをクリックすることで、いつでもオンボーディングプロセスを中断できます。
    
    オンボーディングを全くスキップするか、現在のステップから後で再開するかの選択肢が提示されます。
    
    オンボーディングをスキップしたが開始したい場合は、Wallarm portalの右上隅にあるクエスチョンマークを押して、開かれたサイドバーから「FAST in 5 minutes」を選択してください:
    
    ![“The Quick Help” button][img-quick-help-howto]
    
    以前に延期したオンボーディングプロセスを再開したい場合は、Wallarm portalの右下隅にある「FAST in 5 minutes」ボタンをクリックしてください:
    
    ![The “FAST in 5 minutes” button][img-fast-5mins-button]

FASTを簡単に紹介するために、以下を実施してください:
1.  FASTソリューションについて読んでください。
    
    ![A general information about the FAST solution][img-intro]
    
    次のステップに進むには、「Deploy FAST Node →」ボタンをクリックしてください。
    
2.  自分のマシンにFASTノードを搭載したDockerコンテナを展開してください。そのため、このステップで表示される`docker run`コマンドをコピーし実行してください。コマンドには必要なパラメーターがすべて設定済みです。
    
    ![The deployment hint][img-deploy]
    
    !!! info "Dockerのインストール"
        Dockerがお手元にない場合は、[install it][link-docker-install-docs]からインストールしてください。Community EditionおよびEnterprise Editionのいずれでも適用できます。
    
    FASTノードは起動後、`127.0.0.1:8080`で着信接続を待ち受けます。
    
    ![The deployed FAST node][img-cont-deployed]

    自分のマシン上のブラウザをHTTPプロキシとして`127.0.0.1:8080`を使用するように設定してください。Wallarm portalが開かれているブラウザ以外の任意のブラウザをご利用いただけます。Mozilla Firefoxの使用を推奨します（Firefoxでプロキシを設定する方法については[こちらの手順][link-firefox-proxy]をご参照ください）。
    
    ![The proxy settings in Mozilla Firefox][img-ff-proxy-settings]
    
    !!! info "別のポート番号を使用する場合"
        FASTノードに`8080`ポートを使用したくない場合（例：そのポートで他のサービスが待ち受けている場合）、FASTで使用するポート番号を別途設定できます。そのためには、`docker run`コマンドの`-p`パラメーターに目的のポート番号を指定してください。例として、ポート`9090`を使用するには、次のように記述します: `-p 9090:8080`.
    
    次のステップに進むには、「Create a Test Run →」ボタンをクリックしてください.
    
    !!! info "前のステップに戻る"
        前のステップに戻るには、常に前のステップの名前が記されたボタン（例:「← Understanding FAST」）をクリックできることにご注意ください.
   
3.  “Create test run”ボタンをクリックしてテストランを作成してください。テストランの名前を選択し、オンボーディングヒントに記載された通り、必要なテストポリシーとノードをドロップダウンリストから選択してください:

    ![The creation of a test run][img-create-testrun]
    
    テストランの作成プロセスを完了するには、「Create and run」ボタンを押してください.
    
    次のステップに進むには、「Discover Vulnerabilities →」ボタンをクリックしてください.
    
4.  FASTノードのコンソールに`Recording baselines for TestRun...`というメッセージが表示されていることを確認してください:
    
    ![The FAST node's console][img-recording]
    
    次に、FASTを使用して脆弱性テストを開始するために、[Google Gruyere][link-gruyere-app]という脆弱なアプリケーションへリクエストを送信してください.
    
    そのため、オンボーディングヒントに記載されたHTTPリクエストをコピーし、先に設定したFASTノードをプロキシとして使用するブラウザのアドレスバーに貼り付け、リクエストを実行してください:
    
    ![The HTTP request in the hint][img-http-request]
    
    ![The execution of the HTTP request][img-gruyere-app]
    
    リクエスト送信後、”Actions”ドロップダウンメニューから「Stop recording」を選択してリクエスト記録プロセスを停止してください。操作を「Yes」ボタンをクリックして確定してください:
    
    ![Stopping the request recording process][img-stop-recording]
    
    テストが完了するまでお待ちください。FASTはGoogle GruyereアプリケーションのXSS脆弱性を検出するはずです。脆弱性の識別子と種類はテストランの「Results」列に表示されます:
    
    ![The result of testing][img-results]
    
    !!! info "脆弱性の分析"
        テストランの「Results」列の値をクリックすることで、発見された脆弱性の詳細情報を確認できます:
        
        ![The detailed information about the vulnerability][img-detailed-results]
    
    次のステップに進むには、「Run With It!」ボタンをクリックしてください.
    
5.  このステップで、FASTの使用方法に習熟し、ウェブアプリケーションの脆弱性を発見できたことになります.
    
    ![The end of the onboarding process][img-finish]
    
    より詳細なFASTの始め方については、[“Quick Start guide”][link-qsg]をご参照ください.
    
    オンボーディングプロセスを完了するには、「Finish」ボタンをクリックしてください.
    
    !!! info "追加のアクション"
        脆弱性の検出が成功した後、FASTノードのDockerコンテナを停止し、ブラウザのプロキシ設定を無効にすることができます.