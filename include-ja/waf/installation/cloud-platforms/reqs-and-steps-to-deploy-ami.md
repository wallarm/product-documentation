## 要件

* AWSアカウントが必要です。
* AWS EC2とSecurity Groupsに関する理解が必要です。
* 任意のAWSリージョンを使用できます。Wallarmノードのデプロイ先リージョンに特別な制限はありません。

    Wallarmは単一のアベイラビリティゾーン（AZ）とマルチアベイラビリティゾーンの両方のデプロイに対応しています。マルチAZ構成では、Wallarmノードを別々のアベイラビリティゾーンで起動し、高可用性のためにロードバランサーの背後に配置できます。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です。
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com:444`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com:444`へのアクセスが必要です。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]を使用します。
* すべてのコマンドはWallarmインスタンス上でスーパーユーザー（例: `root`）として実行します。

## 1. AWSでSSHキーペアを作成します

デプロイ中に仮想マシンへSSHで接続する必要があります。Amazon EC2では、インスタンスへの接続に使用できる公開鍵と秘密鍵のSSHキーペアを名前を付けて作成できます。

キーペアを作成するには:

1.  Amazon EC2ダッシュボードの**Key pairs**タブに移動します。
2.  **Create Key Pair**ボタンをクリックします。
3.  キーペア名を入力し、**Create**ボタンをクリックします。

PEM形式のSSH秘密鍵のダウンロードが自動的に開始します。作成したインスタンスに今後接続できるように、この鍵を保存します。

SSHキーの作成に関する詳細は[AWSのドキュメント][link-ssh-keys]を参照します。

## 2. Security Groupを作成します

Security Groupは、仮想マシンに対する受信および送信接続の許可と拒否を定義します。最終的な接続の一覧は保護対象のアプリケーションに依存します（例: TCP/80およびTCP/443ポートへのすべての受信接続を許可）。

Wallarm AMIは最小限の権限で動作するよう設計されています。インスタンスをデプロイする際は、最小権限の原則に基づいてIAMロールを割り当て、Security Groupを構成することを推奨します。これは、ノードの動作に必要なアクセスのみを付与し、AWSのセキュリティベストプラクティスに沿うためです。

フィルタリングノード用のSecurity Groupを作成するには:

1.  Amazon EC2ダッシュボードの**Security Groups**タブに移動し、**Create Security Group**ボタンをクリックします。
2.  表示されたダイアログにSecurity Group名と必要に応じて説明を入力します。
3.  必要なVPCを選択します。
4.  **Inbound**タブと**Outbound**タブで受信および送信接続のルールを構成します。
5.  **Create**ボタンをクリックしてSecurity Groupを作成します。

![Security Groupの作成][img-create-sg]

!!! warning "Security Groupからの送信接続のルール"
    Security Groupを作成すると、既定ではすべての送信接続が許可されます。フィルタリングノードからの送信接続を制限する場合は、Wallarm APIサーバーへのアクセスが許可されていることを必ず確認します。使用しているWallarm Cloudに応じて、許可すべきWallarm APIサーバーが異なります。

    *   US Cloudを使用している場合、ノードには`us1.api.wallarm.com`へのアクセスを許可する必要があります。
    *   EU Cloudを使用している場合、ノードには`api.wallarm.com`へのアクセスを許可する必要があります。
    
    フィルタリングノードが適切に動作するためには、Wallarm APIサーバーへのアクセスが必要です。

Security Groupの作成に関する詳細は[AWSのドキュメント][link-sg]を参照します。

## 3. Wallarmノードインスタンスを起動します

Wallarmフィルタリングノードを含むインスタンスを起動するには、この[リンク](https://aws.amazon.com/marketplace/pp/B073VRFXSD)に進み、フィルタリングノードをサブスクライブします。

インスタンスを作成する際は、次のように[先に作成した][anchor1]Security Groupを指定します:

1. Launch Instanceウィザードで、該当のタブをクリックしてインスタンス起動ステップの**6. Configure Security Group**に進みます。
2. **Assign a security group**設定で**Select an existing security group**オプションを選択します。
3. 表示されたリストからそのSecurity Groupを選択します。

必要なインスタンス設定をすべて指定したら、**Review and Launch**ボタンをクリックし、インスタンスが正しく構成されていることを確認してから**Launch**ボタンをクリックします。

表示されたウィンドウで、次の操作により[先に作成した][anchor2]キーペアを指定します:

1. 最初のドロップダウンリストで**Choose an existing key pair**オプションを選択します。
2. 2つ目のドロップダウンリストでキーペアの名前を選択します。
3. 2つ目のドロップダウンリストで指定したキーペアのPEM形式の秘密鍵にアクセスできることを確認し、その旨のチェックボックスにチェックを入れます。
4. **Launch Instances**ボタンをクリックします。

インスタンスはフィルタリングノードがプリインストールされた状態で起動します。

AWSでのインスタンス起動に関する詳細は[AWSのドキュメント][link-launch-instance]を参照します。

## 4. SSHでフィルタリングノードインスタンスに接続します

SSHでインスタンスに接続する方法の詳細は[AWSのドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)を参照します。

インスタンスに接続するにはユーザー名`admin`を使用します。

!!! info "SSHで接続するためのキーの使用"
    SSHでインスタンスに接続するには、[先ほど作成した][anchor2]PEM形式の秘密鍵を使用します。これは、インスタンス作成時に指定したSSHキーペアの秘密鍵である必要があります。

## 5. フィルタリングノードをWallarm Cloudに接続します

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"