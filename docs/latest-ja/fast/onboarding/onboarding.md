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

#   FASTの新規登録案内

--8<-- "../include-ja/fast/cloud-note.md"

[Wallarm portal][link-wl-portal]へ初めてログインする時、FASTを理解するための5つのステップからなる新規登録案内を利用する機会があります。

!!! info "新規登録案内の制御"
    いつでも新規登録案内パネルの✕ボタンをクリックして新規登録案内を中止することができます。
    
    新規登録案内を完全にスキップするか、最後にいたステップから後で新規登録案内を再開するかの選択肢が提示されます。
    
    新規登録案内をスキップした後で新規登録案内を開始したい場合、Wallarm portalの右上角の疑問符をクリックし、開かれたサイドバーで「FASTを5分で」を選択してください：    
    
    ![!“クイックヘルプ”ボタン][img-quick-help-howto]
    
    以前に中断した新規登録案内を再開したい場合は、Wallarm portalの右下角の「FASTを5分で」ボタンをクリックしてください：
    
    ![!「FASTを5分で」ボタン][img-fast-5mins-button]

FASTについての簡単な紹介を得るために以下のことを行ってください：
1.  FASTソリューションについて読む。
    
    ![!FASTソリューションに関する一般情報][img-intro]
    
    次のステップに進むために「FAST Nodeをデプロイする →」ボタンをクリックします。
    
2.  自分のマシンにFASTノードを含むDockerコンテナをデプロイする。そのためには、このステップで示される`docker run`コマンドをコピーし実行します。コマンドにはすべての必要なパラメータがすでに記入されています。
    
    ![!デプロイメントヒント][img-deploy]
    
    !!! info "Dockerのインストール"
        Dockerがインストールされていない場合は、[ここからインストール][link-docker-install-docs]します。どちらのDockerエディションでも適切と考えられます—Community EditionまたはEnterprise Edition。
    
    FASTノードは起動後に`127.0.0.1:8080`で受信接続をリッスンします。
    
    ![!デプロイされたFASTノード][img-cont-deployed]

    自分のマシンのブラウザをHTTPプロキシとして`127.0.0.1:8080`を使用するように設定します。Wallarmポータルが開かれているものを除く任意のブラウザを使用できます。Mozilla Firefoxの使用を推奨します（Firefoxをプロキシとして使用する設定方法は[こちら][link-firefox-proxy]を参照）。
    
    ![!Mozilla Firefoxのプロキシ設定][img-ff-proxy-settings]
    
    !!! info "別のポート番号を使用"
        FASTノードに`8080`ポートを提供したくない場合（例:そのポートで別のサービスがリッスンしている）、FASTが使用する別のポート番号を設定できます。それを行うには、`docker run`コマンドの`-p`パラメータで必要なポート番号を指定します。例えば、ポート`9090`を使用するには次のように記述します：`-p 9090:8080`.
    
    次のステップに進むために「テストランを作成する →」ボタンをクリックします。
    
    !!! info "前のステップに戻る"
        前のステップの名前（例:「← FASTを理解する」）のボタンをクリックすると、いつでも前のステップに戻ることができます。
   
3.  「テストランを作成する」ボタンをクリックしてテストランを作成します。テストランの名前を選択し、新規登録ヒントに記載されているように、必要なテストポリシーとノードをドロップダウンリストから選択します：

    ![!テストランの作成][img-create-testrun]
    
    「作成して実行」ボタンを押すとテストランの作成プロセスが完了します。
    
    次のステップに進むために「脆弱性を探す →」ボタンをクリックします。
    
4.  FASTノードのコンソールに表示される`Recording baselines for TestRun...`メッセージが表示されていることを確認します：
    
    ![!FASTノードのコンソール][img-recording]
    
    その後、FASTでの脆弱性テストのプロセスを開始するために、[Google Gruyere][link-gruyere-app]という名前の脆弱なアプリケーションにリクエストを送信します。
    
    それを行うためには、新規登録ヒントで提供されるHTTPリクエストをコピーし、先ほどFASTノードをプロキシとして使用するように設定したブラウザのアドレスバーに貼り付け、リクエストを実行します：
    
    ![!ヒント内のHTTPリクエスト][img-http-request]
    
    ![!HTTPリクエストの実行][img-gruyere-app]
    
    リクエストを送信した後、リクエストの記録プロセスを停止するために、「操作」ドロップダウンメニューで「記録を停止する」を選択します。「はい」ボタンを押して操作を確認します：
    
    ![!リクエストの記録プロセスを停止する][img-stop-recording]
    
    テストが完了するのを待ちます。FASTはGoogle GruyereアプリケーションにXSS脆弱性を検出するはずです。脆弱性の識別子とタイプがテストランの「結果」カラムに表示されます：
    
    ![!テストの結果][img-results]
    
    !!! info "脆弱性の分析"
        テストランの「結果」カラムの値をクリックすることで、検出した脆弱性についての詳細情報を得ることができます：
        
        ![!脆弱性の詳細情報][img-detailed-results]
    
    次のステップに進むために「Run With It!」ボタンをクリックします。
    
5.  このステップまでに、あなたはFASTについての理解を深め、Webアプリケーションに脆弱性を検出することに成功しました。
    
    ![!新規登録案内の終了][img-finish]
    
    より詳細な情報を得るために[「クイックスタートガイド」][link-qsg]に進みます。
    
    「終了」ボタンをクリックして新規登録案内を終了します。
    
    !!! info "追加の作業"
        脆弱性の検出が確認できたら、FASTノードのDockerコンテナをシャットダウンし、ブラウザのプロキシングを無効にすることができます。