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
      
[anchor1]:  #1-docker-ソフトウェアのインストール
[anchor2]:  #2-wallarm-クラウドに-fast-ノードを接続するためのトークンの取得
[anchor3]:  #3-必要な環境変数を含むファイルの準備
[anchor4]:  #4-fast-ノード-docker-コンテナのデプロイ
[anchor5]:  #5-プロキシを利用するブラウザの設定
[anchor6]:  #6-ssl-証明書のインストール

    
# FASTノードのデプロイ

この章では、FASTノードのインストールと初期設定のプロセスをガイドします。すべての必要な手順を完了すると、操作可能なFASTノードが得られます。これは `localhost:8080` で待機し、HTTPおよびHTTPSのリクエストを[Google Gruyere][link-https-google-gruyere]アプリケーションへプロキシする準備ができています。FASTノードは、Mozilla Firefoxブラウザと一緒にあなたのマシンにインストールされます。
    
!!! info "ブラウザの使用に関する注釈"
    このガイドでは、Mozilla Firefoxブラウザの使用を推奨しています。しかし、すべてのHTTPおよびHTTPSのトラフィックをFASTノードに送信するように正しく設定した場合、任意のブラウザを使用することも可能です。

![！FASTノードのデプロイスキーム][img-qsg-deployment-scheme]    
        
FASTノードをインストールおよび設定するには、次の手順を実行します:

1.  [Dockerソフトウェアのインストール][anchor1].
2.  [WallarmクラウドにFASTノードを接続するためのトークンを取得します][anchor2].
3.  [必要な環境変数を含むファイルを準備します][anchor3].
4.  [FASTノードのDockerコンテナをデプロイします][anchor4].
5.  [プロキシで動作するようにブラウザを設定します][anchor5].
6.  [SSL証明書をインストールします][anchor6].
            
##  1.  Dockerソフトウェアのインストール 

あなたのマシンにDockerソフトウェアをセットアップします。詳細については、公式Dockerの[インストールガイド][link-docker-docs]を参照してください。

Docker Community Edition（CE）の使用を推奨します。ただし、任意のDockerエディションを使用できます。
    
    
##  2.  WallarmクラウドにFASTノードを接続するためのトークンを取得します

1.  Wallarmアカウントを使って[My Wallarmポータル][link-wl-console]にログインします。

    If you do not have one, then contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access.

2.  「Nodes」タブを選択してから、**Create FAST node ボタン** か **Add FAST node リンク** をクリックします。

    ![！

新ノードの作成][img-fast-create-node]

3.  ダイアログウィンドウが表示されます。ノードに意味のある名前を付け、**作成** ボタンを選択します。このガイドでは、`DEMO NODE` の名前を使用することを推奨しています。

4.  マウスカーソルを作成したノードの**トークン**フィールドに移動し、その値をコピーします。

    !!! info "トークンに関する注釈"
        Wallarm API呼び出しを介してトークンを取得することも可能です。ただし、それはこのドキュメントの範囲を超えています。

##  3.  必要な環境変数を含むファイルの準備 

FASTノードを動作させるためには、いくつかの環境変数を設定する必要があります。

そのためには、テキストファイルを作成し、次のテキストを追加します:

```
WALLARM_API_TOKEN=<ステップ2で取得したトークンの値>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

環境変数を設定しました。その目的は次の通りです：
* `WALLARM_API_TOKEN` — ノードをWallarmクラウドに接続するために使用されるトークン値を設定します
* `ALLOWED_HOSTS` — セキュリティテスト生成の対象とするリクエストの範囲を制限します。`google-gruyere.appspot.com` ドメインへのリクエストのみからセキュリティテストが生成されます。これはターゲットアプリケーションが存在する場所です。

!!! info "`ALLOWED_HOSTS`環境変数の使用"
完全なドメイン名の設定は必須ではありません。部分文字列（例：`google-gruyere` や `appspot.com`）を使用することも可能です。

--8<-- "../include-ja/fast/wallarm-api-host-note.md"
   
##  4.  FASTノード Dockerコンテナのデプロイ

これを行うには、次のコマンドを実行します:

```
docker run --name <name> --env-file=<前のステップで作成された環境変数ファイル> -p <target port>:8080 wallarm/fast
```

コマンドにはいくつかの引数を提供するべきです：
    
* **`--name`** *`<name>`*
        
    Dockerコンテナの名前を指定します。
    
    すべての既存のコンテナ名の中でユニークであるべきです。

* **`--env-file=`** *`<前のステップで作成した環境変数ファイル>`*
    
    コンテナにエクスポートするすべての環境変数を含むファイルを指定します。
    
    [前のステップ][anchor3]で作成したファイルへのパスを指定します。

* **`-p`** *`<target port>`* **`:8080`**
    
    どのDockerホストのポートにコンテナの8080ポートをマッピングするかを指定します。デフォルトでは、コンテナのポートはDockerホストから利用できません。 
    
    Dockerホストから特定のコンテナのポートにアクセスできるようにするためには、コンテナの内部ポートを `-p` 引数を使用して外部ポートに公開する必要があります。

    また、Dockerホストの外部からもアクセスできるようにするために、`-p <host IP>:<target port>:8080` 引数を提供してコンテナのポートをホストの非ループバックIPアドレスに公開することもできます。 

!!! info "docker run コマンドの例"
    次のコマンドの実行は、環境変数ファイル `/home/user/fast.cfg` を使用し、そのポートを `localhost:8080` に公開する `fast-node` という名前のコンテナを起動します：

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

コンテナのデプロイが成功した場合、次のようなコンソール出力が表示されます：

--8<-- "../include-ja/fast/console-include/qsg/fast-node-deployment-ok.md"

これで、Wallarmクラウドに接続した作業用のFASTノードが提供されるべきです。ノードは、`google-gruyere.appspot.com` ドメインへのリクエストを基準として認識する `localhost:8080` 上の受信HTTPおよびHTTPSリクエストを待機しています。
    
    
##  5.  プロキシで動作するようにブラウザを設定します

ブラウザのすべてのHTTPおよびHTTPSリクエストをFASTノードを通してプロキシするように設定します。

Mozilla Firefoxブラウザでプロキシ設定を行うには、次の手順を実行します：

1.  ブラウザを開きます。メニューから「設定」を選択します。「一般」タブを選択し、「ネットワーク設定」までスクロールします。**設定** ボタンを選択します。

    ![！Mozilla Firefoxの設定][img-firefox-options]

2.  「接続設定」ウィンドウが開きます。**手動のプロキシ設定** のオプションを選択します。以下の値を入力してプロキシを設定します：

    * HTTPプロキシアドレスには **`localhost`** 、HTTPプロキシポートには **`8080`**。
    * SSLプロキシアドレスには **`localhost`** 、SSLプロキシポートには **`8080`**。

    行った変更を適用するために **ОК** ボタンを選択します。

    ![！Mozilla Firefoxのプロキシ設定][img-firefox-proxy-options]
    
    
##  6.  SSL証明書をインストールします

HTTPSを介した[Google Gruyere][link-https-google-gruyere]アプリケーションの使用中に、以下のようなブラウザメッセージが表示される場合があります:

![！“Insecure connection” message][img-insecure-connection]

HTTPSを介してWebアプリケーションと対話するためには、自己署名のFASTノードSSL証明書を追加する必要があります。それを行うには、この[リンク][link-ssl-installation]に移動し、リストからブラウザを選択し、説明されている必要な操作を実行します。このガイドでは、Mozilla Firefoxブラウザの使用を推奨しています。

FASTノードの起動と設定を完了したら、この章のゴールはすべて達成されるはずです。次の章では、少なくともいくつかの基準リクエストに基づいたセキュリティテストのセットを生成するために必要なことを学びます。