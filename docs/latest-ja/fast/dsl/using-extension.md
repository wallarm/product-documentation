[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# FAST拡張機能の使用

## 拡張機能の接続 {#connecting-extensions}

作成した拡張機能を使用するには、FAST nodeに接続する必要があります。

次のいずれかの方法で実施できます:
* 拡張機能をディレクトリに配置し、`docker run`コマンドの`-v`オプションを使用して、このディレクトリをFAST nodeのDockerコンテナにマウントします。
    
    ```
    sudo docker run --name <container name> --env-file=<file with environment variables> -v <directory with extensions>:/opt/custom_extensions -p <target port>:8080 wallarm/fast
    ```
    
    **例:**
    
    以下の引数でDockerコンテナ内にFAST nodeを起動するには、次のコマンドを実行します:

    1.  コンテナ名: `fast-node`
    2.  環境変数ファイル: `/home/user/fast.cfg`
    3.  FAST拡張機能のディレクトリパス: `/home/user/extensions`
    4.  コンテナの`8080`ポートを公開するポート: `9090`

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* 拡張機能を公開Gitリポジトリに配置し、FAST nodeのDockerコンテナで、対象のリポジトリを参照する環境変数を定義します。
    
    そのために、次の手順を実施します:
    
    1.  環境変数を含むファイルに`GIT_EXTENSIONS`変数を追加します。

        **例:**
        
        拡張機能が`https://github.com/wallarm/fast-detects`のGitリポジトリにある場合、次の環境変数を定義します:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  環境変数を含むファイルを使用して、FAST nodeのDockerコンテナを次のように起動します:
        
        ```
        sudo docker run --name <container name> --env-file=<file with environment variables> -p <target port>:8080 wallarm/fast
        ```
        
        **例:**
        
        以下の引数でDockerコンテナ内にFAST nodeを起動するには、次のコマンドを実行します:

        1.  コンテナ名: `fast-node`
        2.  環境変数ファイル: `/home/user/fast.cfg`
        3.  コンテナの`8080`ポートを公開するポート: `9090`
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

 FAST nodeが正常に起動すると、Wallarm Cloudへの正常な接続と読み込まれた拡張機能の数を知らせる次の出力がコンソールに表示されます:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

ノードの起動中にエラーが発生した場合、エラー情報がコンソールに出力されます。拡張機能の構文エラーに関するメッセージ例を以下に示します:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "拡張機能の配置要件"
    ネストしたディレクトリ内の拡張機能は接続されません（例: 拡張機能が`extensions/level-2/`ディレクトリに配置されている場合）。選択した接続方法に応じて、拡張機能はFAST nodeのDockerコンテナにマウントするディレクトリのルート、またはGitリポジトリのルートに配置する必要があります。

## 拡張機能の動作確認

先に作成した[`mod-extension.yaml`][doc-mod-extension]および[`non-mod-extension.yaml`][doc-non-mod-extension]拡張機能の動作を確認するには、次の操作を行います:

1.  [前述の手順][anchor-connect-extension]に従って拡張機能をFAST nodeに接続します。

2.  テスト用ポリシーを作成します。これはFAST nodeに接続されているすべてのFAST拡張機能で使用されます。テストポリシーの動作の詳細は[こちら][doc-testpolicy]にあります。

    接続済みの修正型拡張機能はベースラインリクエスト内の`POST_JSON_DOC_HASH_email_value`ポイントを変更し、非修正型拡張機能は`URI`ポイントでの操作権限を必要とすることを思い出してください。
    
    したがって、1回のテスト実行で両方の拡張機能を実行するには、テストポリシーで次の操作を許可する必要があります:
    
    * POSTパラメータ
    * URIパラメータ
    
    ![テストポリシーウィザード、「Insertion points」タブ][img-test-policy-insertion-points]
    
    また、これらの拡張機能はアプリケーションがSQLi攻撃に脆弱かどうかをチェックします。したがって、Wallarm FAST detectsを使用して、他の脆弱性（例: RCE）についてもアプリケーションをチェックしておくと便利です。これにより、SQLiの脆弱性が、組み込みのFAST detectsではなく、作成した拡張機能によって検出されていることを確認できます。 
    
    ![テストポリシーウィザード、「Attacks to test」タブ][img-test-policy-attacks]
    
    最終的なテストポリシーは次のようになります:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  作成したテスト用ポリシーに基づいて、FAST nodeのTest runを作成します。
    
    ![Test run][img-test-run]

4.  FAST nodeが次のような情報メッセージをコンソールに出力するまで待ちます: `Recording baselines for TestRun#`。これは、FAST nodeがベースラインリクエストの記録準備ができたことを意味します。<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5.  以下の例のように、ランダムなパラメータを含むPOSTリクエストをFAST node経由でOWASP Juice Shopのログインページに送信します:
    
    ```
    curl --proxy http://<FAST node IP address> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    リクエストの送信には`curl`など任意のツールを使用できます。
    
    !!! info "ベースラインリクエスト記録プロセスの停止"
        ベースラインリクエストを送信した後は、記録プロセスを停止することを推奨します。この手順は[こちら][link-stop-recording]に記載しています。

6.  FAST nodeのコンソール出力には、次の内容が表示されます:  

    * 対象アプリケーションが組み込みのFAST detectsでテストされること
    * ベースラインリクエストのPOSTパラメータに対して修正型FAST拡張機能が実行されること
    * ベースラインリクエストのURIパラメータに対して非修正型FAST拡張機能が実行されること
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    WallarmのWebインターフェイスでTest run情報を開き、“Details”リンクをクリックすると、リクエスト処理の完全なログを確認できます。
    
    ![Test runの詳細情報][img-testrun-details]
    
    ![リクエスト処理のフルログ][img-log]

7.  検出された問題数を含むリンク（例: “2 issues”）をクリックすると、検出された脆弱性の情報も確認できます。“Vulnerabilities”ページが開きます。

    ![WallarmのWebインターフェイスのVulnerabilities][img-vulns]
    
    FAST拡張機能で検出された脆弱性については、“Risk”、“Type”、“Title”の各列に、拡張機能の`meta-info`セクションで指定した値が表示されます。

8.  脆弱性をクリックすると、その詳細情報（拡張機能ファイルの`meta-info`セクションにある説明、およびそれを悪用するリクエストの例を含む）を表示できます。

    脆弱性情報の例（修正型拡張機能で検出されたもの）:
    
    ![脆弱性の詳細情報][img-vuln-details-mod]