[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment/5-qsg-fast-inst-scheme.png
[img-fast-create-node]:         ../../images/fast/qsg/common/deployment/6-qsg-fast-inst-create-node.png   
[img-firefox-options]:          ../../images/fast/qsg/common/deployment/9-qsg-fast-inst-ff-options-window.png
[img-firefox-proxy-options]:    ../../images/fast/qsg/common/deployment/10-qsg-fast-inst-ff-proxy-options.png
[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

[link-https-google-gruyere]:    https://google-gruyere.appspot.com
[link-docker-docs]:             https://docs.docker.com/
[link-wl-console]:              https://us1.my.wallarm.com
[link-ssl-installation]:        ../ssl/intro.md

[wl-cloud-list]:    ../cloud-list.md
      
[anchor1]:  #1-install-the-docker-software              
[anchor2]:  #2-obtain-a-token-that-will-be-used-to-connect-your-fast-node-to-the-wallarm-cloud
[anchor3]:  #3-prepare-a-file-containing-the-necessary-environment-variables 
[anchor4]:  #4-deploy-the-fast-node-docker-container 
[anchor5]:  #5-configure-the-browser-to-work-with-the-proxy
[anchor6]:  #6-install-ssl-certificates 
    
    
# FASTノードのデプロイ

本章ではFASTノードのインストールと初期構成のプロセスについてご案内します。必要な手順をすべて完了すると、動作しているFASTノードが利用可能になります。このノードは`localhost:8080`で待ち受け、HTTPおよびHTTPSのリクエストを[Google Gruyere][link-https-google-gruyere]アプリケーションへプロキシ転送する準備が整っております。ノードはお使いのマシンにMozilla Firefoxブラウザとともにインストールされます。
    
!!! info "使用するブラウザについての注意"
    ガイドではMozilla Firefoxブラウザの使用が推奨されています。しかし、任意のブラウザを使用することも可能です。HTTPおよびHTTPSのトラフィックをFASTノードに正しく転送するように設定できれば問題ありません。

![利用中のFASTノードのデプロイスキーム][img-qsg-deployment-scheme]    
        
FASTノードをインストールして構成するには、以下の手順を実行してください:

1.  [Dockerソフトウェアをインストール][anchor1].
2.  [FASTノードをWallarmクラウドに接続するためのトークンを取得][anchor2].
3.  [必要な環境変数を含むファイルを準備][anchor3].
4.  [FASTノードDockerコンテナをデプロイ][anchor4].
5.  [プロキシ対応のブラウザを構成][anchor5].
6.  [SSL証明書をインストール][anchor6].
            
##  1.  Dockerソフトウェアのインストール

お使いのマシンにDockerソフトウェアを設定します。詳細については、公式Docker[インストールガイド][link-docker-docs]をご参照ください。

Docker Community Edition (CE)の使用が推奨されていますが、他のDockerエディションも利用可能です。
    
    
##  2.  FASTノードをWallarmクラウドに接続するためのトークンを取得

1.  お使いのWallarmアカウントで[My Wallarm portal][link-wl-console]にログインします。

    Wallarmアカウントをお持ちでない場合は、[Wallarm Sales Team](mailto:sales@wallarm.com)に連絡してアクセスを取得してください。

2.  「Nodes」タブを選択し、次に**Create FAST node**ボタン（または**Add FAST node**リンク）をクリックします。

    ![新しいノードの作成][img-fast-create-node]

3.  ダイアログウィンドウが表示されます。ノードに分かりやすい名前を付け、**Create**ボタンを選択してください。ガイドでは`DEMO NODE`の名前の使用が推奨されています。
    
4.  作成されたノードの**Token**フィールドにマウスカーソルを合わせ、値をコピーしてください。

    !!! info "トークンに関する注意"
        Wallarm APIコールを使用してトークンを取得することも可能ですが、それは本書の範囲外です。 
        
##  3.  必要な環境変数を含むファイルの準備

FASTノードを動作させるためには、いくつかの環境変数を設定する必要があります。そのため、テキストファイルを作成し、以下の内容を追加してください:

```
WALLARM_API_TOKEN=<the token value you obtained in step 2>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

これで環境変数の設定が完了しました。それぞれの目的は以下のとおりです:
* `WALLARM_API_TOKEN` — ノードをWallarmクラウドに接続するために使用されるトークン値を設定します。
* `ALLOWED_HOSTS` — セキュリティテストを生成するリクエストの範囲を制限します。セキュリティテストは`google-gruyere.appspot.com`ドメインへのリクエストからのみ生成され、これは対象アプリケーションが存在するドメインです。
    
!!! info " `ALLOWED_HOSTS`環境変数の使用について"
    完全修飾ドメイン名を設定する必要はありません。部分文字列（例: `google-gruyere`または`appspot.com`）でも構いません。

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  FASTノードDockerコンテナのデプロイ

これを行うには、次のコマンドを実行してください:

```
docker run --name <name> --env-file=<environment variables file created on the previous step> -p <target port>:8080 wallarm/fast
```

コマンドにはいくつかの引数を指定する必要があります:
    
* **`--name`** *`<name>`*
        
    Dockerコンテナの名前を指定します。
    
    既存のコンテナ名の中で一意である必要があります。
    
* **`--env-file=`** *`<environment variables file created in the previous step>`*
    
    コンテナにエクスポートするすべての環境変数を含むファイルを指定します。
    
    [前のステップ][anchor3]で作成したファイルへのパスを指定してください。

* **`-p`** *`<target port>`* **`:8080`**
    
    Dockerホストのポートを指定し、コンテナの内部ポート8080をマッピングします。既定では、コンテナのポートはDockerホストから利用できません。 
    
    Dockerホストから特定のコンテナポートへのアクセスを許可するには、`-p`引数を使用してコンテナの内部ポートを外部ポートに公開してください。 
    
    さらに、`-p <host IP>:<target port>:8080`引数を指定することで、コンテナのポートをホスト上のループバック以外のIPアドレスに公開し、外部からもアクセス可能にすることができます。        

!!! info " `docker run`コマンドの例"
    以下のコマンドを実行すると、環境変数ファイル`/home/user/fast.cfg`を使用し、ポートを`localhost:8080`に公開する`fast-node`という名前のコンテナが実行されます:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

コンテナのデプロイが成功すると、次のようなコンソール出力が表示されます:

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

これで、Wallarmクラウドに接続された動作可能なFASTノードが準備できました。ノードは、`google-gruyere.appspot.com`ドメインへのリクエストを基準として認識し、`localhost:8080`でHTTPおよびHTTPSのリクエストを待ち受けています。
    
    
##  5.  ブラウザのプロキシ設定

すべてのHTTPおよびHTTPSリクエストをFASTノード経由で送信するようにブラウザを構成してください。

Mozilla Firefoxブラウザでプロキシ設定を行うには、以下の手順を実行してください:

1.  ブラウザを起動します。メニューから「Preferences」を選択し、「General」タブを選択して「Network Settings」までスクロールします。その後、**Settings**ボタンを選択してください。

    ![Mozilla Firefoxのオプション][img-firefox-options]

2.  「Connection Settings」ウィンドウが表示されます。**Manual proxy configuration**オプションを選択し、以下の値を入力してプロキシを構成します:

    * HTTPプロキシアドレスには**`localhost`**、HTTPプロキシポートには**`8080`**を入力してください。
    * SSLプロキシアドレスには**`localhost`**、SSLプロキシポートには**`8080`**を入力してください。
        
    変更を適用するには、**ОК**ボタンを選択してください。

    ![Mozilla Firefoxのプロキシ設定][img-firefox-proxy-options]
    
    
##  6.  SSL証明書のインストール

HTTPS経由で[Google Gruyere][link-https-google-gruyere]アプリケーションを利用する際、安全な接続が中断されたとのブラウザメッセージが表示される場合があります:

![「安全でない接続」メッセージ][img-insecure-connection]

HTTPS経由でWebアプリケーションとやり取りするためには、自己署名のFASTノードSSL証明書を追加する必要があります。そのため、この[リンク][link-ssl-installation]にアクセスし、リストからご利用のブラウザを選択して、記載されている必要な手順を実行してください。本ガイドではMozilla Firefoxブラウザの使用が推奨されています.
        
FASTノードを実行・構成することで、本章のすべての目標が達成されたはずです。次の章では、いくつかの基準リクエストに基づいてセキュリティテストのセットを生成するために必要な事項について説明します.