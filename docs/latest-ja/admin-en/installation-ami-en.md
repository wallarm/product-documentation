[link-ssh-keys]:            https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #3-create-a-security-group
[anchor2]:      #2-create-a-pair-of-ssh-keys

[img-create-sg]:                ../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../updating-migrating/versioning-policy.md#version-list
[installation-instr-latest]:    /admin-en/installation-ami-en/
[img-wl-console-users]:         ../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:    ../installation/supported-deployment-options.md

# Amazon Machine Image (AMI) としてデプロイする

フィルタリングノードを備えた Amazon Machine Image をデプロイするには、次の手順を実行します:

1. Amazon Web Services アカウントにログインします。
2. SSH キーペアを作成します。
3. セキュリティグループを作成します。
4. フィルタリングノードインスタンスを起動します。
5. SSH 経由でフィルタリングノードインスタンスに接続します。
6. フィルタリングノードを Wallarm クラウドに接続します。
7. プロキシサーバーを使用するようにフィルタリングノードを設定します。
8. フィルタリングおよびプロキシングルールを設定します。
9. Wallarm ノードのインスタンスメモリを割り当てます。
10. ロギングを設定します。
11. NGINX を再起動します。

## 1. Amazon Web Services アカウントにログインする

[aws.amazon.com](https://aws.amazon.com/en/) にログインします。

## 2. SSH キーペアを作成する

デプロイの過程で、SSH を介して仮想マシンに接続する必要があります。Amazon EC2 では、インスタンスに接続するために使用できる名前付きの公開および秘密の SSH キーペアを作成することができます。

キーペアを作成するには、次の手順を行います:

1. Amazon EC2 ダッシュボードで、**キーペア** タブに移動します。
2. **キーペアの作成** ボタンをクリックします。
3. キーペア名を入力し、**作成** ボタンをクリックします。

PEM 形式の秘密の SSH キーが自動的にダウンロードされます。将来作成されたインスタンスに接続するためにキーを保存してください。

!!! info "SSHキーの作成"
    SSH キーの作成に関する詳細情報は、この [リンク][link-ssh-keys] を参照してください。

## 3.セキュリティグループを作成する

セキュリティグループは、仮想マシンの許可されたおよび禁止された受信および送信接続を定義します。最終的な接続リストは、保護対象のアプリケーションによって異なります（たとえば、TCP/80 および TCP/443 ポートへのすべての受信接続を許可する）。

!!! warning "セキュリティグループからの送信接続のルール"
    セキュリティグループを作成すると、デフォルトですべての送信接続が許可されます。フィルタリングノードからの送信接続を制限する場合は、Wallarm API サーバーへのアクセスが許可されていることを確認してください。使用している Wallarm クラウドによって、Wallarm API サーバーが異なります。

    *   US クラウドを使用している場合、ノードでは `us1.api.wallarm.com` へのアクセスを許可する必要があります。
    *   EU クラウドを使用している場合、ノードでは `api.wallarm.com` へのアクセスを許可する必要があります。

フィルタリングノードは、正しい動作のために Wallarm API サーバーへのアクセスが必要です。

フィルタリングノードのセキュリティグループを作成します。これを行うには、以下の手順を実行します。

1. Amazon EC2 ダッシュボードで、**セキュリティグループ** タブに移動し、**セキュリティグループの作成** ボタンをクリックします。
2. 表示されるダイアログウィンドウに、セキュリティグループ名とオプションの説明を入力します。
3. 必要な VPC を選択します。
4. **インバウンド** および **アウトバウンド** タブで、受信および送信接続ルールを構成します。
5. セキュリティグループを作成するには、**作成** ボタンをクリックします。

![!セキュリティグループを作成する][img-create-sg]

セキュリティグループの作成に関する詳細情報は、この [リンク][link-sg] を参照してください。

## 4. フィルタリングノードインスタンスを起動する

フィルタリングノード4.4を含むインスタンスを起動するには、[こちらのリンク](https://aws.amazon.com/marketplace/pp/B073VRFXSD) にアクセスしてサブスクライブしてください。

インスタンスを作成する際に、[事前に作成した][anchor1] セキュリティグループを指定する必要があります。これを行うには、次のアクションを実行します。

1. Launch Instance Wizard を使用して作業する場合、**6. Configure Security Group** インスタンス起動ステップに進むには、対応するタブをクリックします。
2. **セキュリティグループを割り当てる** 設定で、**既存のセキュリティグループを選択する** オプションを選択します。
3. 表示されるリストから、セキュリティグループを選択します。

必要なインスタンス設定をすべて指定した後、**Review and Launch** ボタンをクリックし、インスタンスが正しく設定されていることを確認してから、**Launch** ボタンをクリックします。

表示されるウィンドウで、[事前に作成した][anchor2] キーペアを指定します。これを行うには、以下の操作を実行します。

1. 最初のドロップダウンリストで、**既存のキーペアを選択する** オプションを選択します。
2. 2つ目のドロップダウンリストで、キーペアの名前を選択します。
3. 2つ目のドロップダウンリストで指定したキーペアの PEM 形式の秘密鍵を持っていることを確認し、確認のためにチェックボックスにチェックを入れます。
4. **インスタンスの起動** ボタンをクリックします。

インスタンスは、プリインストールされたフィルタリングノードとともに起動します。

AWS でインスタンスを起動する方法の詳細については、この [リンク][link-launch-instance] を参照してください。

## 5. SSH 経由でフィルタリングノードインスタンスに接続する

インスタンスに接続するには、`admin` ユーザー名を使用する必要があります。

!!! info "SSH 接続時にキーを使用する"
    SSH を介してインスタンスに接続するために、以前に [作成した][anchor2] PEM 形式の秘密キーを使用します。これは、インスタンスの作成時に指定した SSH キーペアの秘密キーでなければなりません。

インスタンスへの接続方法の詳細については、この [リンク](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/AccessingInstances.html) を参照してください。

## 6. フィルタリングノードを Wallarm クラウドに接続する

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.0-only-with-postanalytics.md"

## 7. プロキシサーバーを使用するようにフィルタリングノードを設定する

--8<-- "../include-ja/setup-proxy.md"

## 8. フィルタリングおよびプロキシングルールを設定する

--8<-- "../include-ja/setup-filter-nginx-en-latest.md"

## 9. Wallarm ノードのインスタンスメモリ割り当て

フィルタリングノードは、インメモリストレージ Tarantool を使用します。

デフォルトでは、Tarantool に割り当てられる RAM の量は、インスタンスメモリの合計の 40% です。

Tarantool に割り当てられる RAM の量を変更することができます。Tarantool にインスタンス RAM を割り当てるには：

1. Tarantool の設定ファイルを開きます：

    ```
    sudo vim /etc/default/wallarm-tarantool
    ```

2. `SLAB_ALLOC_ARENA` で割り当てられる RAM の量を GB で設定します。値は整数または浮動小数点数にできます（小数点 `.` が小数点区切り記号として使用されます）。

   本番環境では、postanalytics モジュールに割り当てる推奨メモリ量は、サーバーの合計メモリの 75% です。Wallarm ノードをテストするか、インスタンス サイズが小さい場合は、より少ない量で十分です（例: 合計メモリの 25%）。

   例：
    
    === "ノードをテストしている場合"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "本番環境にノードを展開している場合"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```
3. 変更を適用するには、Tarantool デーモンを再起動します。

    ```
    sudo systemctl restart wallarm-tarantool
    ```

## 10. ロギングを設定する

--8<-- "../include-ja/installation-step-logging.md"

## 11. NGINX を再起動する

以下のコマンドを実行して、NGINX を再起動します：

``` bash
sudo systemctl restart nginx
```    
    
## インストールは完了です

インストールが完了しました。

--8<-- "../include-ja/check-setup-installation-en.md"

--8<-- "../include-ja/filter-node-defaults.md"

--8<-- "../include-ja/installation-extra-steps.md"