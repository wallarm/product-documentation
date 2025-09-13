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

この章では、FASTノードのインストールと初期設定の手順を案内します。必要な手順をすべて完了すると、FASTノードが稼働します。ノードは`localhost:8080`で待ち受け、[Google Gruyere][link-https-google-gruyere]アプリケーションへのHTTPおよびHTTPSリクエストをプロキシする準備が整います。ノードはお使いのマシンに、Mozilla Firefoxブラウザーとともにインストールされます。
    
!!! info "使用するブラウザーに関する注意"
    本ガイドではMozilla Firefoxブラウザーの使用を推奨します。ただし、すべてのHTTPおよびHTTPSトラフィックをFASTノードへ送信するように正しく設定できれば、任意のブラウザーを使用できます。

![FASTノードのデプロイ構成図][img-qsg-deployment-scheme]    
        
FASTノードをインストールして設定するには、次の手順を実施します。

1.  [Dockerソフトウェアをインストールします][anchor1]。
2.  [FASTノードをWallarm cloudに接続するために使用されるトークンを取得します][anchor2]。
3.  [必要な環境変数を含むファイルを準備します][anchor3]。
4.  [FASTノードのDockerコンテナをデプロイします][anchor4]。
5.  [プロキシで動作するようにブラウザーを設定します][anchor5]。
6.  [SSL証明書をインストールします][anchor6]。
            
##  1.  Dockerソフトウェアをインストールします 

お使いのマシンにDockerソフトウェアをセットアップします。詳細はDocker公式の[インストールガイド][link-docker-docs]を参照してください。

Docker Community Edition (CE)の使用を推奨しますが、どのDockerエディションでも使用できます。
    
    
##  2.  FASTノードをWallarm cloudに接続するために使用されるトークンを取得します

1.  Wallarmアカウントを使用して[My Wallarm portal][link-wl-console]にログインします。

    アカウントをお持ちでない場合は、アクセス権の取得について[Wallarm営業チーム](mailto:sales@wallarm.com)にお問い合わせください。

2.  「Nodes」タブを選択し、**Create FAST node**ボタン（または**Add FAST node**リンク）をクリックします。

    ![新規ノードの作成][img-fast-create-node]

3.  ダイアログウィンドウが表示されます。ノードに意味のある名前を付け、**Create**ボタンを選択します。本ガイドでは`DEMO NODE`という名前の使用を推奨します。
    
4.  作成したノードの**Token**フィールドにマウスカーソルを移動し、値をコピーします。

    !!! info "トークンに関する注意"
        トークンはWallarm APIコールでも取得できますが、本ドキュメントの範囲外です。 
        
##  3.  必要な環境変数を含むファイルを準備します 

FASTノードを動作させるには、いくつかの環境変数を設定する必要があります。

そのために、テキストファイルを作成して次の内容を追加します。

```
WALLARM_API_TOKEN=<ステップ2で取得したトークン値>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

環境変数を設定しました。各変数の目的は次のとおりです。
* `WALLARM_API_TOKEN`：ノードをWallarm cloudに接続するために使用するトークン値を設定します
* `ALLOWED_HOSTS`：セキュリティテストを生成する対象リクエストの範囲を制限します。対象アプリケーションが存在するドメイン`google-gruyere.appspot.com`へのリクエストからのみ、セキュリティテストが生成されます。
    
!!! info "`ALLOWED_HOSTS`環境変数の使用"
    完全修飾ドメイン名を設定する必要はありません。文字列の一部（例：`google-gruyere`や`appspot.com`）でも構いません。

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  FASTノードのDockerコンテナをデプロイします

次のコマンドを実行します。

```
docker run --name <name> --env-file=<environment variables file created on the previous step> -p <target port>:8080 wallarm/fast
```

このコマンドには、いくつかの引数を指定します。
    
* **`--name`** *`<name>`*
        
    Dockerコンテナの名前を指定します。
    
    既存のすべてのコンテナ名と重複しない一意の名前にしてください。
    
* **`--env-file=`** *`<environment variables file created in the previous step>`*
    
    コンテナにエクスポートするすべての環境変数を含むファイルを指定します。
    
    [前のステップ][anchor3]で作成したファイルへのパスを指定する必要があります。

* **`-p`** *`<target port>`* **`:8080`**
    
    コンテナの8080ポートをマッピングするDockerホスト側のポートを指定します。デフォルトでは、コンテナのポートはDockerホストから利用できません。 
    
    Dockerホストから特定のコンテナポートへアクセスできるようにするには、`-p`引数を使用して、コンテナの内部ポートを外部ポートに公開します。 
    
    また、`-p <host IP>:<target port>:8080`引数を指定することで、ホストの非ループバックIPアドレスにコンテナのポートを公開し、Dockerホスト外部からもアクセス可能にできます。        

!!! info "`docker run`コマンドの例"
    次のコマンドを実行すると、`/home/user/fast.cfg`の環境変数ファイルを使用し、ポートを`localhost:8080`に公開する、`fast-node`という名前のコンテナが起動します。

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

コンテナのデプロイが成功すると、次のようなコンソール出力が表示されます。

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

これで、Wallarm cloudに接続された、すぐに使用可能なFASTノードが用意できました。ノードは`localhost:8080`で受信するHTTPおよびHTTPSリクエストのうち、ドメイン`google-gruyere.appspot.com`宛てのリクエストをベースラインとして認識して待ち受けています。
    
    
##  5.  プロキシで動作するようにブラウザーを設定します

すべてのHTTPおよびHTTPSリクエストがFASTノード経由でプロキシされるように、ブラウザーを設定します。 

Mozilla Firefoxブラウザーでプロキシを設定するには、次の手順を実施します。

1.  ブラウザーを開きます。メニューから“Preferences”を選択します。“General”タブを選択し、“Network Settings”までスクロールします。**Settings**ボタンを選択します。

    ![Mozilla Firefoxのオプション][img-firefox-options]

2.  “Connection Settings”ウィンドウが開きます。**Manual proxy configuration**オプションを選択します。次の値を入力してプロキシを設定します。

    * HTTPプロキシアドレスとして**`localhost`**、HTTPプロキシポートとして**`8080`**。 
    * SSLプロキシアドレスとして**`localhost`**、SSLプロキシポートとして**`8080`**。
        
    変更を適用するため、**ОК**ボタンを選択します。

    ![Mozilla Firefoxのプロキシ設定][img-firefox-proxy-options]
    
    
##  6.  SSL証明書をインストールします

HTTPS経由で[Google Gruyere][link-https-google-gruyere]アプリケーションを操作すると、安全な接続が中断されたことに関する次のようなブラウザーメッセージが表示される場合があります。

![“Insecure connection”メッセージ][img-insecure-connection]

HTTPSでWebアプリケーションとやり取りできるように、自己署名のFASTノードSSL証明書を追加する必要があります。これを行うには、この[リンク][link-ssl-installation]に移動し、一覧からお使いのブラウザーを選択して、記載の手順を実施します。本ガイドではMozilla Firefoxブラウザーの使用を推奨します。
        
FASTノードの起動と設定が完了したら、本章の目標はすべて達成です。次の章では、少数のベースラインリクエストに基づいてセキュリティテストのセットを生成するために必要な事項を学習します。