## 要件

* AWSアカウントが必要です
* AWS EC2やSecurity Groupの基本知識が必要です
* Wallarmノードの展開に特定のリージョン制限はなく、任意のAWSリージョンを使用できます
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)において、**Administrator**ロールが割り当てられたアカウントへのアクセスと二要素認証が無効になっている必要があります
* US Wallarm Cloudで作業する場合は `https://us1.api.wallarm.com:444`、EU Wallarm Cloudで作業する場合は `https://api.wallarm.com:444` へのアクセスが必要です。アクセスをプロキシサーバ経由でのみ構成できる場合は、[手順][wallarm-api-via-proxy]に従ってください
* 攻撃検知ルールの更新と[API仕様書][api-spec-enforcement-docs]のダウンロード、ならびに[allowlisted, denylisted, or graylisted][ip-lists-docs]国、リージョン、またはデータセンターに対する正確なIPの取得のため、以下のIPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarmインスタンス上で全てのコマンドをスーパーユーザー（例: `root`）として実行する必要があります

## 1. AWSでSSHキーのペアを作成する

デプロイ中は、SSHを使用して仮想マシンに接続する必要があります。Amazon EC2では、インスタンスへの接続に使用できる公開鍵と秘密鍵のペアを作成できます。

キーペアを作成するには:

1. Amazon EC2ダッシュボードの**Key pairs**タブに移動します。
2. **Create Key Pair**ボタンをクリックします。
3. キーペア名を入力し、**Create**ボタンをクリックします。

PEM形式の秘密SSHキーが自動的にダウンロードされます。今後、作成したインスタンスに接続するため、このキーを保存しておいてください。

SSHキーの作成に関する詳細情報については、[AWS documentation][link-ssh-keys]をご参照ください。

## 2. セキュリティグループの作成

セキュリティグループは、仮想マシンに対する許可された受信および送信接続を定義します。最終的な接続リストは、保護するアプリケーションによって決まります（例: TCP/80およびTCP/443ポートへの全ての受信接続を許可するなど）。

フィルタリングノード用にセキュリティグループを作成するには:

1. Amazon EC2ダッシュボードの**Security Groups**タブに移動し、**Create Security Group**ボタンをクリックします。
2. 表示されるダイアログウィンドウにセキュリティグループ名と任意の説明を入力します。
3. 必要なVPCを選択します。
4. **Inbound**および**Outbound**タブで受信および送信接続のルールを設定します。
5. **Create**ボタンをクリックしてセキュリティグループを作成します。

![セキュリティグループの作成][img-create-sg]

!!! warning "セキュリティグループからの送信接続のルール"
    セキュリティグループを作成する際、デフォルトではすべての送信接続が許可されています。フィルタリングノードの送信接続を制限する場合は、該当ノードにWallarm APIサーバーへのアクセスが許可されていることを確認してください。利用するWallarm Cloudによって、選択するWallarm APIサーバーは以下の通りです：

    * US Cloudを使用する場合、ノードは `us1.api.wallarm.com` へのアクセスが許可されている必要があります。
    * EU Cloudを使用する場合、ノードは `api.wallarm.com` へのアクセスが許可されている必要があります。
    
    フィルタリングノードは正しく動作するためにWallarm APIサーバーへのアクセスが必要です。

セキュリティグループの作成に関する詳細情報は、[AWS documentation][link-sg]をご参照ください。

## 3. Wallarmノードインスタンスの起動

Wallarmのフィルタリングノードを含むインスタンスを起動するには、この[リンク](https://aws.amazon.com/marketplace/pp/B073VRFXSD)にアクセスし、フィルタリングノードをサブスクライブしてください。

インスタンス作成時には、[以前に作成した][anchor1]セキュリティグループを次の手順に従って指定します:

1. Launch Instance Wizardで作業中に、**6. Configure Security Group**タブをクリックしてインスタンス起動ステップに進みます。
2. **Assign a security group**設定において、**Select an existing security group**オプションを選択します。
3. 表示されるリストからセキュリティグループを選択します。

必要なインスタンス設定を全て指定した後、**Review and Launch**ボタンをクリックしてインスタンスが正しく構成されていることを確認し、**Launch**ボタンをクリックします。

表示されるウィンドウで、[以前に作成した][anchor2]キーペアを以下の手順で指定します:

1. 最初のドロップダウンリストで**Choose an existing key pair**オプションを選択します。
2. 次のドロップダウンリストでキーペアの名前を選択します。
3. 2番目のドロップダウンリストで指定したキーペアのPEM形式の秘密鍵にアクセスできることを確認し、チェックボックスにチェックを入れます。
4. **Launch Instances**ボタンをクリックします。

インスタンスが事前インストールされたフィルタリングノードとともに起動されます。

AWSでのインスタンス起動に関する詳細情報は、[AWS documentation][link-launch-instance]をご参照ください。

## 4. SSHを使用してフィルタリングノードインスタンスに接続する

SSHを使用してインスタンスに接続する方法の詳細情報については、[AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)をご参照ください。

`admin`ユーザー名を使用してインスタンスに接続する必要があります。

!!! info "SSH経由での接続に鍵を使用する"
    以前に[作成した][anchor2]PEM形式の秘密鍵を使用して、SSH経由でインスタンスに接続してください。これは、インスタンス作成時に指定したSSHキーペアの秘密鍵である必要があります。

## 5. Wallarm Cloudにインスタンスを接続するためのトークンを生成する

ローカルのWallarmフィルタリングノードは、[適切な種類][wallarm-token-types]のWallarmトークンを使用してWallarm Cloudに接続する必要があります。APIトークンを使用すると、Wallarm Console UIでノードグループを作成でき、ノードインスタンスを効果的に管理できます。

![グループ化されたノード][img-grouped-nodes]

トークンを以下の手順で生成します:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens**にアクセスします（[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)）。
    2. `Deploy`ソースロールのAPIトークンを探すか作成します。
    3. このトークンをコピーします。
=== "Node token"

    1. Wallarm Console → **Nodes**にアクセスします（[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)）。
    2. 次のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合、ノードのメニューから**Copy token**を選択してトークンをコピーします。