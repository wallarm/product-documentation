[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/


#   自分のSSL証明書をFASTノードにインストールする

!!! info "前提条件"
    このガイドは以下を前提としています：
    
    * ブラウザがHTTPまたはHTTPSプロキシとしてFASTノードを使用するように設定されています。
    * ブラウザはすでに、FASTノードにインストールする予定のSSL証明書を信頼しています。

!!! warning "証明書の要件"
    このインストールを成功させるためには、SSL証明書はルート証明書または中間証明書のいずれかでなければなりません。
    
    証明書および対応する秘密鍵は、[PEMでエンコード][link-pem-encoding]されていなければなりません。証明書が異なるエンコーディングを持っている場合は、[OpenSSL][link-openssl]などの利用可能な証明書変換ツールを使用して、PEMエンコード証明書に変換することができます。

##  SSL証明書のインストール

FASTノードにSSL証明書をインストールするには、以下の手順に従ってください：
1.  すでにSSL証明書と、その証明書を署名した秘密鍵をPEM形式で持っていることを確認します。

2.  証明書ファイルと鍵ファイルをDockerホストの同一ディレクトリに配置します。次の手順でこのディレクトリをFASTノードを持つDockerコンテナにマウントする必要があります。

3.  下記の環境変数を使用して、証明書と鍵が存在するFASTノードを特定します：

    ```
    CA_CERT=<証明書への内部パス>
    CA_KEY=<鍵への内部パス>
    ```
    
    上記の行の`<証明書への内部パス>`と`<鍵への内部パス>`をDockerコンテナでディレクトリをマウントした後の証明書と鍵への予定パスに置き換えます.

4.  下記のコマンドを実行してFASTノードを持つDockerコンテナをデプロイします：

    ```
    docker run --name <名前> \ 
    -e WALLARM_API_TOKEN=<トークン> \
    -e ALLOWED_HOSTS=<ホストリスト> \
    -e CA_CERT=<証明書への内部パス> \
    -e CA_KEY=<鍵への内部パス> \
    -v <証明書と鍵のあるディレクトリへのパス>:<ディレクトリへの内部パス> \
    -p <公開ポート>:8080 \
    wallarm/fast
    ```
    
    このコマンドは次のパラメータを定義します：
    
    * コンテナの名前。
    * `WALLARM_API_TOKEN`と`ALLOWED_HOSTS`環境変数を使用して、ターゲットアプリケーションのトークンとホストリスト（後者は任意です）。
    * `CA_CERT`変数を使用したコンテナ内のSSL証明書ファイルの位置。
    * `CA_KEY`変数を使用したコンテナ内の秘密鍵ファイルの位置。
    * アプリケーションの公開ポート。
    
    `docker run`コマンドの`-v`オプションを使用して、Dockerホストの`<証明書と鍵のあるディレクトリへのパス>`のディレクトリをコンテナにマウントします。このディレクトリの内容は、`<ディレクトリへの内部パス>`のパス内のコンテナ内で利用可能になります。
        
    !!! warning "注意"
        `CA_CERT`および`CA_KEY`環境変数で指定した証明書と鍵ファイルへのパスは、`docker run`コマンドの`-v`オプションで指定した`<ディレクトリへの内部パス>`パラメータの中にあるファイルを指していなければなりません。   

これで、SSL証明書が正常にインストールされたはずです。FASTノードのインスタンスは、これで信頼されていない証明書メッセージなしにHTTPSリクエストをプロキシするようになります。


##  SSL証明書のインストールの例

以下は、次のとおりであると想定されています：
* SSL証明書と対応する秘密鍵の`cert.pem`と`cert.key`ファイルが、FASTノードが起動しているDockerホストの`/home/user/certs`ディレクトリにあります。
* `/home/user/certs`ディレクトリの内容は、FASTノードを持つコンテナ内の`/tmp/certs`パスで利用可能になります。
* `fast_token`トークンが使用されています。
* ホストリストには`example.com`のみが含まれています。
* FASTノードは`fast-node`という名前のコンテナで実行され、その内部ポート`8080`は`localhost:8080`で公開されます。

次に、SSL証明書をFASTノードに接続するために次のコマンドを実行する必要があります：

```
docker run --name fast-node \
-e WALLARM_API_TOKEN="fast_token" \
-e ALLOWED_HOSTS="example.com" \
-e CA_CERT="/tmp/certs/cert.pem" \
-e CA_KEY="/tmp/certs/cert.key" \
-v /home/user/certs:/tmp/certs \
-p 8080:8080 \
wallarm/fast
```