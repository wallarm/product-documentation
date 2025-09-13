## 要件

* AWSアカウントが必要です。
* AWS EC2とSecurity Groupsの理解が必要です。
* 任意のAWSリージョンを使用できます。Wallarmノードのデプロイにリージョンの特別な制限はありません。

    Wallarmは単一Availability Zone(AZ)および複数Availability Zone構成の両方をサポートします。マルチAZ構成では、Wallarm Nodesを別々のAvailability Zoneで起動し、高可用性のためにLoad Balancerの背後に配置できます。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です。
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com:444`に、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com:444`にアクセスできる必要があります。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]を使用してください。
* 以下のIPアドレスへのアクセスが必要です。これは、攻撃検出ルールと[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、また[allowlisted, denylisted, or graylisted][ip-lists-docs]の国・地域・データセンターの正確なIPを取得するために必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarmインスタンス上で、すべてのコマンドをスーパーユーザー（例:`root`）として実行する必要があります。

## 1. AWSでSSHキーのペアを作成する

デプロイの過程で、SSHで仮想マシンに接続する必要があります。Amazon EC2では、インスタンスへの接続に使用できる公開鍵と秘密鍵の名前付きSSHキー・ペアを作成できます。

キー・ペアを作成するには:

1. Amazon EC2ダッシュボードの**Key pairs**タブに移動します。
2. **Create Key Pair**ボタンをクリックします。
3. キー・ペア名を入力し、**Create**ボタンをクリックします。

PEM形式の秘密SSHキーのダウンロードが自動的に開始されます。今後、作成したインスタンスに接続するためにこのキーを保存してください。

SSHキーの作成に関する詳細は、[AWSドキュメント][link-ssh-keys]を参照してください。

## 2. セキュリティグループを作成する

セキュリティグループは、仮想マシンに対する受信および送信接続の許可・禁止を定義します。最終的な接続のリストは保護対象のアプリケーションに依存します（例: TCP/80およびTCP/443ポートへのすべての受信接続を許可するなど）。

Wallarm AMIは最小限の権限セットで動作するように設計されています。インスタンスをデプロイする際は、最小権限の原則に基づいてIAMロールを割り当て、ノードの動作に必要なアクセスのみを付与するようにセキュリティグループを構成することを推奨します。これはAWSのセキュリティベストプラクティスに沿うものです。

フィルタリングノード用のセキュリティグループを作成するには:

1. Amazon EC2ダッシュボードの**Security Groups**タブに移動し、**Create Security Group**ボタンをクリックします。
2. 表示されるダイアログで、セキュリティグループ名と任意の説明を入力します。
3. 必要なVPCを選択します。
4. **Inbound**および**Outbound**タブで、受信および送信の接続ルールを構成します。
5. **Create**ボタンをクリックしてセキュリティグループを作成します。

![セキュリティグループの作成][img-create-sg]

!!! warning "セキュリティグループからの送信接続のルール"
    セキュリティグループを作成する際、送信接続はデフォルトで全許可です。フィルタリングノードからの送信接続を制限する場合は、Wallarm APIサーバーへのアクセスが許可されていることを必ず確認してください。どのWallarm APIサーバーにアクセスするかは、使用しているWallarm Cloudに依存します。

    *   US Cloudを使用している場合、ノードには`us1.api.wallarm.com`へのアクセスを許可する必要があります。
    *   EU Cloudを使用している場合、ノードには`api.wallarm.com`へのアクセスを許可する必要があります。
    
    フィルタリングノードが正しく動作するためには、Wallarm APIサーバーへのアクセスが必要です。

セキュリティグループの作成に関する詳細は、[AWSドキュメント][link-sg]を参照してください。

## 3. Wallarmノードインスタンスを起動する

Wallarmフィルタリングノードを含むインスタンスを起動するには、この[リンク](https://aws.amazon.com/marketplace/pp/B073VRFXSD)に移動し、フィルタリングノードをサブスクライブしてください。

インスタンスを作成する際は、次の手順で[以前に作成した][anchor1]セキュリティグループを指定する必要があります:

1. Launch Instance Wizardの操作中に、該当するタブをクリックしてインスタンス起動手順の**6. Configure Security Group**に進みます。
2. **Assign a security group**設定で**Select an existing security group**オプションを選択します。
3. 表示されるリストから該当のセキュリティグループを選択します。

必要なインスタンス設定をすべて指定したら、**Review and Launch**ボタンをクリックし、インスタンスが正しく構成されていることを確認してから**Launch**ボタンをクリックします。

表示されるウィンドウで、次の操作に従って[以前に作成した][anchor2]キー・ペアを指定します:

1. 1つ目のドロップダウンリストで**Choose an existing key pair**オプションを選択します。
2. 2つ目のドロップダウンリストでキー・ペアの名前を選択します。
3. 2つ目のドロップダウンリストで指定したキー・ペアのPEM形式の秘密鍵にアクセスできることを確認し、その旨を示すチェックボックスにチェックを入れます。
4. **Launch Instances**ボタンをクリックします。

フィルタリングノードがプリインストールされた状態でインスタンスが起動します。

AWSでのインスタンス起動に関する詳細は、[AWSドキュメント][link-launch-instance]を参照してください。

## 4. SSHでフィルタリングノードインスタンスに接続する

SSHでインスタンスに接続する方法の詳細は、[AWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)を参照してください。

インスタンスに接続するには、ユーザー名として`admin`を使用する必要があります。

!!! info "SSH接続にキーを使用する"
    SSHでインスタンスに接続するには、[前に作成した][anchor2]PEM形式の秘密鍵を使用してください。これは、インスタンス作成時に指定したSSHキー・ペアの秘密鍵である必要があります。

## 5. インスタンスをWallarm Cloudに接続するためのトークンを生成する

ローカルのWallarmフィルタリングノードは、[適切な種類][wallarm-token-types]のWallarmトークンを使用してWallarm Cloudに接続する必要があります。API tokenを使用すると、Wallarm Console UIでノードグループを作成でき、ノードインスタンスを効率的に整理できます。

![ノードのグループ化][img-grouped-nodes]

以下の手順でトークンを生成します:

=== "APIトークン"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **Settings** → **API tokens**を開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPI tokenを新規作成するか、既存のものを選択します。
    1. このトークンをコピーします。
=== "ノードトークン"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開きます。
    1. 次のいずれかを実行します: 
        * タイプが**Wallarm node**のノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合、ノードのメニュー → **Copy token**でトークンをコピーします。