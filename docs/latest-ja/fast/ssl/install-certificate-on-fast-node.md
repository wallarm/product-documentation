[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/

# FASTノードにSSL証明書をインストールする

!!! info "前提条件"
    本ガイドは、以下を前提としています:
    
    * お使いのブラウザはFASTノードをHTTPまたはHTTPSプロキシとして使用するように構成されています。
    * お使いのブラウザはすでにFASTノードにインストールするSSL証明書を信頼しています。

!!! warning "証明書の要件"
    本インストールを正常に完了するため、お使いのSSL証明書はルート証明書または中間証明書である必要があります。
    
    証明書および対応する秘密鍵は[PEMエンコーディング][link-pem-encoding]を使用してエンコードされている必要があります。証明書が異なるエンコーディングの場合、[OpenSSL][link-openssl]などの任意の証明書変換ツールを使用してPEMエンコードの証明書に変換できます。

## SSL証明書のインストール

FASTノードにSSL証明書をインストールするには、以下の手順に従ってください:
1.  PEM形式のSSL証明書および証明書に署名した秘密鍵がすでに存在していることを確認してください。

2.  Dockerホスト上で証明書ファイルと秘密鍵ファイルを同一ディレクトリに配置してください。このディレクトリは次の手順でFASTノードが実行されるDockerコンテナにマウントする必要があります。

3.  以下の環境変数を使用して、証明書と秘密鍵が存在するFASTノードを指定してください:

    ```
    CA_CERT=<internal path to the certificate>
    CA_KEY=<internal path to the key>
    ```
    
    上記の各行において、`<internal path to the certificate>`と`<internal path to the key>`の値を、Dockerコンテナにディレクトリをマウントした後の証明書と秘密鍵のパスに置き換えてください。

4.  以下のコマンドを実行して、FASTノードを含むDockerコンテナをデプロイしてください:

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
    
    このコマンドは以下のパラメータを定義します:
    
    * コンテナの名前。
    * `WALLARM_API_TOKEN`および`ALLOWED_HOSTS`環境変数を使用して対象アプリケーションのトークンとホストリスト（後者は任意）を設定します。
    * `CA_CERT`変数を使用してコンテナ内のSSL証明書ファイルの場所を指定します。
    * `CA_KEY`変数を使用してコンテナ内の秘密鍵ファイルの場所を指定します。
    * アプリケーションの公開ポート。
    
    `docker run`コマンドの`-v`オプションを使用して、Dockerホスト上の`<path to the directory with the certificate and key>`ディレクトリをコンテナにマウントしてください。このディレクトリの内容は、コンテナ内の`<internal path to the directory>`パスで利用可能になります。
        
    !!! warning "注意"
        `docker run`コマンドの`-v`オプションで指定した`<internal path to the directory>`パラメータ内のファイルを指すように、`CA_CERT`および`CA_KEY`環境変数で指定する証明書および秘密鍵ファイルのパスを設定してください。

これでSSL証明書が正常にインストールされました。FASTノードは今後、信頼されていない証明書に関するメッセージを表示することなくHTTPSリクエストをプロキシします。

## SSL証明書のインストール例

以下のようなケースを例とします:
* SSL証明書と対応する秘密鍵ファイル`cert.pem`および`cert.key`は、FASTノードが起動されるDockerホストの`/home/user/certs`ディレクトリに配置されています。
* `/home/user/certs`ディレクトリの内容は、FASTノードが実行されるコンテナ内で`/tmp/certs`パスとして利用可能になります。
* トークンとして`fast_token`が使用されます。
* ホストリストには`example.com`のみが含まれます。
* FASTノードは`fast-node`という名前のコンテナで実行され、その内部ポート`8080`は`localhost:8080`で公開されます。

その場合、SSL証明書をFASTノードに接続するために、以下のコマンドを実行してください:

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