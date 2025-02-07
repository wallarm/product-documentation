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

# FAST Extensionsの使用

## 拡張機能の接続

作成した拡張機能を利用するには、FAST nodeに接続する必要があります。

以下のいずれかの方法で行えます:
* 拡張機能をディレクトリに配置し、そのディレクトリを`docker run`コマンドの`-v`オプションを使用してFAST node Dockerコンテナにマウントします.
    
    ```
    sudo docker run --name <container name> --env-file=<file with environment variables> -v <directory with extensions>:/opt/custom_extensions -p <target port>:8080 wallarm/fast
    ```
    
    **例:**
    
    以下の引数を用いてDockerコンテナ内でFAST nodeを起動するため、以下のコマンドを実行します:

    1. コンテナ名：`fast-node`.
    2. 環境変数ファイル：`/home/user/fast.cfg`.
    3. FAST Extensionsの拡張機能ディレクトリパス：`/home/user/extensions`.
    4. コンテナの`8080`ポートが公開されるポート：`9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* 拡張機能を公開Gitリポジトリに配置し、必要なリポジトリを参照する環境変数をFAST node Dockerコンテナに定義します.
    
    これを行うには、以下を実施します:
    
    1. 環境変数が記載されたファイルに`GIT_EXTENSIONS`変数を追加します.

        **例:**
        
        拡張機能が`https://github.com/wallarm/fast-detects` Gitリポジトリにある場合、以下の環境変数を定義します:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2. 以下のように、環境変数が記載されたファイルを使用してFAST node Dockerコンテナを起動します:
        
        ```
        sudo docker run --name <container name> --env-file=<file with environment variables> -p <target port>:8080 wallarm/fast
        ```
        
        **例:**
        
        以下の引数を用いてDockerコンテナ内でFAST nodeを起動するため、以下のコマンドを実行します:

        1. コンテナ名：`fast-node`.
        2. 環境変数ファイル：`/home/user/fast.cfg`.
        3. コンテナの`8080`ポートが公開されるポート：`9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

FAST nodeが正常に起動すると、Wallarm Cloudへの接続成功とロードされた拡張機能の数が通知される以下の出力がコンソールに書き込まれます:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

ノードの起動中にエラーが発生した場合、エラー情報がコンソールに書き込まれます。拡張機能の構文エラーに関するメッセージは以下の例に示されます:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "拡張機能の配置要件"
    入れ子になったディレクトリ内の拡張機能は接続されません（例えば、拡張機能が`extensions/level-2/`ディレクトリに配置されている場合）。接続の方法によって、拡張機能はFAST node DockerコンテナにマウントされるディレクトリのルートまたはGitリポジトリのルートに配置する必要があります.

## 拡張機能の動作確認

以前作成した[`mod-extension.yaml`][doc-mod-extension]および[`non-mod-extension.yaml`][doc-non-mod-extension]拡張機能の動作を確認するには、以下の手順を実行します:

1. 上記の手順に従って拡張機能をFAST nodeに接続します.

2. テストポリシーを作成します。このポリシーはFAST nodeに接続されているすべてのFAST拡張機能で使用されます。テストポリシーの動作に関する詳細情報は[こちら][doc-testpolicy]に記載されています.

    接続された変更拡張機能はベースラインリクエスト内の`POST_JSON_DOC_HASH_email_value`ポイントを変更し、変更を伴わない拡張機能は`URI`ポイントでの作業権限を必要とすることを改めてご案内します.
    
    したがって、両方の拡張機能を1回のテスト実行中に動作させるには、テストポリシーで以下に対する作業を許可する必要があります:
    
    * POSTパラメータ
    * URIパラメータ
    
    ![テストポリシーウィザード、「Insertion points」タブ][img-test-policy-insertion-points]
    
    また、拡張機能はアプリケーションがSQLi攻撃に対して脆弱かどうかを確認するため、Wallarm FAST detects（例：RCE）を用いて他の脆弱性をチェックすることも便利です。これにより、組み込みのFAST detectsではなく、作成した拡張機能によりSQLi脆弱性が検出されていることを確認できます.
    
    ![テストポリシーウィザード、「Attacks to test」タブ][img-test-policy-attacks]
    
    結果として、テストポリシーは以下のようになります:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3. 作成したテストポリシーに基づいて、FAST nodeのテスト実行を作成します.
    
    ![テスト実行][img-test-run]

4. FAST nodeが`Recording baselines for TestRun#`のような情報メッセージをコンソールに出力するまで待ちます。これは、FAST nodeがベースラインリクエストの記録準備が整ったことを意味します。<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5. 以下の例のように、FAST node経由でOWASP Juice Shopログインページに対してランダムなパラメータを含むPOSTリクエストを作成し送信します:
    
    ```
    curl --proxy http://<FAST node IP address> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    リクエストの送信には`curl`などのツールを使用できます.
    
    !!! info "ベースラインリクエスト記録プロセスの停止"
        ベースラインリクエスト送信後、記録プロセスを停止することを推奨します。この手順については[こちら][link-stop-recording]に記載されています.

6. FAST nodeのコンソール出力で以下が確認できます:  

    * 対象アプリケーションが組み込みのFAST detectsを用いてテストされます,
    * ベースラインリクエスト内のPOSTパラメータに対して変更拡張機能が実行されます,
    * ベースラインリクエスト内のURIパラメータに対して変更無し拡張機能が実行されます.
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    Wallarmウェブインターフェースでテスト実行情報を開き、"Details"リンクをクリックすることでリクエスト処理の完全なログを確認できます.
    
    ![詳細なテスト実行情報][img-testrun-details]
    
    ![リクエスト処理の完全なログ][img-log]

7. 検出された問題の数（例："2 issues."）が記載されたリンクをクリックすることで、検出された脆弱性に関する情報も確認できます。"Vulnerabilities"ページが表示されます.
    
    ![Vulnerabilities on the Wallarm web interface][img-vulns]
    
    「Risk」、「Type」、および「Title」カラムには、FAST拡張機能の支援を受けて検出された脆弱性について、拡張機能ファイルの`meta-info`セクションに指定された値が表示されます.

8. 脆弱性をクリックすると、その説明（拡張機能ファイルの`meta-info`セクションから）およびその脆弱性を突くリクエストの例など、詳細情報を表示できます.

    脆弱性に関する情報の例（変更拡張機能で検出された場合）:
    
    ![脆弱性の詳細情報][img-vuln-details-mod]