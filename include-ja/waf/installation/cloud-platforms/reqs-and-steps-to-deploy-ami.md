## 要件

* AWSアカウント
* AWS EC2およびセキュリティグループの理解が必要です
* 任意のAWSリージョン。Wallarmノードのデプロイに特定のリージョンの制限はありません
* 【US Cloud】または【EU Cloud】のWallarm Consoleで**Administrator**ロールのアカウントにアクセスできる必要があります。また、2要素認証は無効になっている必要があります
* US Wallarm Cloudを使用する場合は`https://us1.api.wallarm.com:444`へのアクセス、EU Wallarm Cloudを使用する場合は`https://api.wallarm.com:444`へのアクセスが必要です。もしプロキシサーバ経由でのみアクセスの設定が可能な場合は、[instructions][wallarm-api-via-proxy]に従ってください
* Wallarmインスタンス上で全てのコマンドをスーパーユーザ（例：`root`）として実行する必要があります

## 1. AWSでSSHキーペアを作成する

デプロイ作業中に、SSH経由で仮想マシンに接続する必要があります。Amazon EC2では、インスタンスへの接続に使用できる名前付きの公開鍵と秘密鍵のSSHキーペアを作成できます。

キーペアの作成方法は以下の通りです:

1. Amazon EC2ダッシュボードの**Key pairs**タブに移動します。
2. **Create Key Pair**ボタンをクリックします。
3. キーペアの名前を入力し、**Create**ボタンをクリックします。

PEM形式の秘密SSH鍵が自動的にダウンロードされます。将来、作成したインスタンスに接続するためにこの鍵を保存しておきます。

SSH鍵の作成に関する詳細情報は、[AWSドキュメント][link-ssh-keys]を参照してください。

## 2. セキュリティグループの作成

セキュリティグループは、仮想マシンへの許可されたおよび禁止された着信および発信接続を定義します。最終的な接続リストは保護対象アプリケーションに依存します（例：TCP/80およびTCP/443ポートへの全ての着信接続を許可するなど）。

フィルタリングノード用のセキュリティグループを作成する手順は以下の通りです:

1. Amazon EC2ダッシュボードの**Security Groups**タブに移動し、**Create Security Group**ボタンをクリックします。
2. 表示されるダイアログウィンドウにセキュリティグループ名と必要に応じて説明を入力します。
3. 必要なVPCを選択します。
4. **Inbound**および**Outbound**タブで着信および発信接続のルールを設定します。
5. **Create**ボタンをクリックし、セキュリティグループを作成します。

![セキュリティグループの作成][img-create-sg]

!!! warning "セキュリティグループの発信接続ルール"
    セキュリティグループを作成する際、デフォルトですべての発信接続が許可されています。フィルタリングノードの発信接続を制限する場合は、Wallarm APIサーバへのアクセスが許可されていることを確認してください。Wallarm APIサーバの選択は、使用しているWallarm Cloudに依存します:

    *   US Cloudを使用している場合、ノードに`us1.api.wallarm.com`へのアクセスが許可されている必要があります。
    *   EU Cloudを使用している場合、ノードに`api.wallarm.com`へのアクセスが許可されている必要があります。
    
    フィルタリングノードは、正しく動作するためにWallarm APIサーバへのアクセスを必要とします。

セキュリティグループの作成に関する詳細情報は、[AWSドキュメント][link-sg]を参照してください。

## 3. Wallarmノードインスタンスの起動

Wallarmフィルタリングノードを搭載したインスタンスを起動するには、こちらの[リンク](https://aws.amazon.com/marketplace/pp/B073VRFXSD)にアクセスしてフィルタリングノードをサブスクライブしてください。

インスタンス作成時に、次の手順で[以前に作成した][anchor1]セキュリティグループを指定する必要があります:

1. Launch Instance Wizardを操作中に、対応するタブをクリックして**6. Configure Security Group**のインスタンス起動ステップに進みます。
2. **Assign a security group**設定で**Select an existing security group**オプションを選択します。
3. 表示されるリストからセキュリティグループを選択します。

必要なインスタンスの設定をすべて指定した後、**Review and Launch**ボタンをクリックし、インスタンスが正しく構成されていることを確認の上、**Launch**ボタンをクリックします。

表示されるウィンドウで、次の手順に従い[以前に作成した][anchor2]キーペアを指定します:

1. 1つ目のドロップダウンリストから**Choose an existing key pair**オプションを選択します。
2. 2つ目のドロップダウンリストでキーペアの名前を選択します。
3. 2つ目のドロップダウンリストで指定したキーペアのPEM形式の秘密鍵にアクセスできることを確認し、チェックボックスにチェックを入れます。
4. **Launch Instances**ボタンをクリックします。

インスタンスはフィルタリングノードがあらかじめインストールされた状態で起動します。

AWSにおけるインスタンスの起動に関する詳細情報は、[AWSドキュメント][link-launch-instance]を参照してください。

## 4. SSHによるフィルタリングノードインスタンスへの接続

SSH経由でインスタンスに接続する方法の詳細については、[AWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)を参照してください。

インスタンスに接続する際は、`admin`ユーザ名を使用する必要があります。

!!! info "SSH接続における鍵の使用"
    SSH経由でインスタンスに接続するために、[以前に作成した][anchor2]PEM形式の秘密鍵を使用してください。これは、インスタンス作成時に指定したSSHキーペアの秘密鍵である必要があります。

## 5. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"