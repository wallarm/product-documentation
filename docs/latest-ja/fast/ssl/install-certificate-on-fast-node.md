[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/


#   FAST nodeへの独自SSL証明書のインストール

!!! info "前提条件"
    このガイドでは、次のことを前提としています:
    
    * ブラウザがHTTPまたはHTTPSプロキシとしてFAST nodeを使用するように設定されています。
    * FAST node用にインストールするSSL証明書をブラウザが既に信頼しています。

!!! warning "証明書の要件"
    このインストールを正常に完了するには、SSL証明書がルート証明書または中間証明書である必要があります。
    
    証明書および対応する秘密鍵は[PEMでエンコードされている][link-pem-encoding]必要があります。証明書のエンコードが異なる場合は、[OpenSSL][link-openssl]など利用可能な証明書変換ツールを使用して、PEMでエンコードされた証明書に変換できます。

##  SSL証明書のインストール

FAST nodeにSSL証明書をインストールするには、次の手順に従います:
1.  PEM形式のSSL証明書と、その証明書に署名した秘密鍵を既に用意していることを確認します。

2.  証明書ファイルと鍵ファイルをDockerホスト上の同じディレクトリに配置します。次の手順で、このディレクトリをFAST nodeを含むDockerコンテナにマウントする必要があります。

3.  以下の環境変数を使用して、証明書と鍵が存在する場所をFAST nodeに指定します:

    ```
    CA_CERT=<internal path to the certificate>
    CA_KEY=<internal path to the key>
    ```
    
    上記の行では、`<internal path to the certificate>`および`<internal path to the key>`の値を、ディレクトリをDockerコンテナにマウントした後の証明書と鍵の想定パスに置き換えます。

4.  以下のコマンドを実行して、FAST nodeを含むDockerコンテナをデプロイします:

    ```
    docker run --name <name> \ 
    -e WALLARM_API_TOKEN=<token> \
    -e ALLOWED_HOSTS=<host list> \
    -e CA_CERT=<internal path to the certificate> \
    -e CA_KEY=<internal path to the key> \
    -v <path to the directory with the certificate and key>:<internal path to the directory> \
    -p <publishing port>:8080 \
    wallarm/fast
    ```
    
    このコマンドは次のパラメータを定義します:
    
    * コンテナ名。
    * 対象アプリケーションのトークンとホストリスト（`WALLARM_API_TOKEN`および`ALLOWED_HOSTS`環境変数を使用します。後者は必須ではありません）。
    * コンテナ内のSSL証明書ファイルの場所（`CA_CERT`変数を使用）。
    * コンテナ内の秘密鍵ファイルの場所（`CA_KEY`変数を使用）。
    * アプリケーションの公開ポート。
    
    コンテナにDockerホストのディレクトリ`<path to the directory with the certificate and key>`をマウントするには、`docker run`コマンドの`-v`オプションを使用します。このディレクトリの内容は、コンテナ内では`<internal path to the directory>`のパスで利用可能になります。 
        
    !!! warning "注意"
        環境変数`CA_CERT`および`CA_KEY`で指定する証明書と鍵ファイルのパスは、`docker run`コマンドの`-v`オプションで指定した`<internal path to the directory>`パラメータ内のファイルを指している必要があります。   

これでSSL証明書が正常にインストールされました。FAST nodeインスタンスは、信頼されていない証明書に関するメッセージを表示することなくHTTPSリクエストをプロキシします。


##  SSL証明書のインストール例。

次の条件を想定します:
* SSL証明書および対応する秘密鍵である`cert.pem`と`cert.key`ファイルが、FAST nodeを起動するDockerホストの`/home/user/certs`ディレクトリにあること、
* FAST nodeを含むコンテナ内では、`/home/user/certs`ディレクトリの内容が`/tmp/certs`パスで利用可能になること、
* 使用するトークンは`fast_token`であること、
* ホストリストには`example.com`のみが含まれること、そして
* FAST nodeは`fast-node`という名前のコンテナで実行され、内部ポート`8080`が`localhost:8080`として公開されること、

この場合、SSL証明書をFAST nodeに接続するには次のコマンドを実行します:

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