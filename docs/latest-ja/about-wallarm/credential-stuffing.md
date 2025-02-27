# クレデンシャルスタッフィング検出 <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[クレデンシャルスタッフィング](../attacks-vulns-list.md#credential-stuffing)は、ハッカーが漏洩したユーザー認証情報のリストを使用して複数のウェブサイト上のユーザーアカウントに不正にアクセスするサイバー攻撃です。本記事では、Wallarmの**クレデンシャルスタッフィング検出**を使用してこの種の脅威を検出する方法について説明します。

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/sz9nukwy2hx4" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

クレデンシャルスタッフィング攻撃は、複数のサービスで同じユーザー名とパスワードを再利用する一般的な慣行や、容易に推測可能な（弱い）パスワードを採用する傾向のため、非常に危険です。成功するクレデンシャルスタッフィング攻撃は試行回数が少なく済むため、攻撃者はリクエストを非常に低頻度で送信でき、ブルートフォース保護などの標準的な対策が効果を発揮しにくくなります。

## Wallarmによるクレデンシャルスタッフィングへの対応

Wallarmの**クレデンシャルスタッフィング検出**は、漏洩または弱い認証情報を使用してアプリケーションへアクセスしようとする試行に関するリアルタイム情報を収集・表示します。また、そのような試行に関する即時通知を可能にし、アプリケーションへアクセスするために使用された全ての漏洩または弱い認証情報のリストをダウンロード可能な形式で作成します。

Wallarmは、漏洩および弱いパスワードの特定のため、公開されている[HIBP](https://haveibeenpwned.com/)の漏洩認証情報データベースから収集された**8億5,000万件**以上のレコードを含む包括的なデータベースを使用します。

![クレデンシャルスタッフィング - スキーマ](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarmのクレデンシャルスタッフィング検出は、以下の手順により認証情報の安全性を確保します。

1. リクエストがノードに到達すると、パスワードから[SHA-1](https://en.wikipedia.org/wiki/SHA-1)が生成され、いくつかの文字がCloudに送信されます。
1. Cloudは受信した文字列で始まる既知の漏洩パスワードのデータベースをチェックします。発見された場合、SHA-1暗号化形式のデータがノードに送信され、ノードはリクエスト内のパスワードと比較します。
1. 一致した場合、ノードはリクエストから取得したログイン情報を含め、この攻撃がクレデンシャルスタッフィング攻撃であることをCloudに通知します。
1. ノードはリクエストをアプリケーションに渡します。

このため、Wallarmノードを搭載したマシンからのパスワードがWallarm Cloudに暗号化されずに送信されることはありません。認証情報は同時に送信されないため、クライアントの認証データはネットワーク内で安全に管理されます。

**大量および単一の試行**

クレデンシャルスタッフィング検出は、ボットによる大量の漏洩認証情報の使用試行と、その他の手法では検出不可能な単一の試行の両方を登録することが可能です。

**軽減策**

漏洩または弱いパスワードを持つアカウントの情報を把握することで、アカウント所有者への連絡や、一時的なアクセス停止など、これらのアカウントのデータ保護のための対策を講じることができます。

Wallarmは、パスワードが弱い、もしくは漏洩している場合でも正当なユーザーのアクセスをブロックしないため、漏洩認証情報を使用したリクエストをブロックしません。しかし、以下の場合はクレデンシャルスタッフィングの試行がブロックされる可能性があります。

* 悪意のあるボット活動の一環として検出され、[API Abuse Prevention](../api-abuse-prevention/overview.md)モジュールが有効になっている場合。
* その他の[攻撃の兆候](../attacks-vulns-list.md)を伴うリクエストである場合。

## 有効化

Wallarmの**クレデンシャルスタッフィング検出**を有効化するには、以下の手順を実施してください。

1. お使いの[サブスクリプションプラン](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)に**クレデンシャルスタッフィング検出**が含まれていることを確認します。サブスクリプションプランの変更をご希望の場合は、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.)までリクエストを送信してください。
1. Wallarmノードが[バージョン4.10](../updating-migrating/what-is-new.md)以降であり、以下のいずれかのアーティファクトを使用してデプロイされていることを確認してください。

    * [All-in-one installer](../installation/nginx/all-in-one.md)
    * [Helm chart for NGINX-based Ingress controller](../admin-en/installation-kubernetes-en.md)
    * [NGINX-based Docker image](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
1. お使いのユーザーの[ロール](../user-guides/settings/users.md#user-roles)が**クレデンシャルスタッフィング検出**の設定を許可していることを確認してください。
1. Wallarm Console→**Credential Stuffing**に移動し、機能を有効化します（初期状態では無効です）。

**クレデンシャルスタッフィング検出**が有効化されると、動作開始のための[設定](#configuring)が必要となります。

## 設定

認証情報の使用試行を確認するためにチェックする認証エンドポイントのリストを作成する必要があります。リスト作成には、Wallarm Console→**Credential Stuffing**に移動してください。

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

エンドポイントをリストに追加する方法は2通りあります。

* **Recommended endpoints**リストから追加する方法  
  このリストには以下の2種類の要素が含まれています:

    * Wallarmが定義したルール（正規表現を活用）により、一般的に使用される認証エンドポイントと、パラメータとしてパスワードとログインが格納されるものが指定されています。
    <!--
        ![クレデンシャルスタッフィング - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * [API Discovery](../api-discovery/overview.md)モジュールによって検出され、実際にトラフィックを受信した認証エンドポイント。
  
* 手動で追加する方法  
  ご自身のユニークな認証エンドポイントを追加して、完全な保護を実現することも可能です。手動で追加する場合、[URI](../user-guides/rules/rules.md#uri-constructor)および認証パラメータの検索方法を設定してください:

    * **Exact location of parameters** ― パスワードおよびログインが配置されている具体的なエンドポイント[リクエストポイント](../user-guides/rules/rules.md#configuring)を指定する必要があります。
    <!--
        ![クレデンシャルスタッフィング - 認証エンドポイント追加 - 正確な位置](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * **Regular expression** ― パスワードおよびログインが含まれるエンドポイントパラメータを[正規表現](../user-guides/rules/rules.md#condition-type-regex)を使用して検索します。
    
        ![クレデンシャルスタッフィング - 認証エンドポイント追加 - 正規表現](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## 漏洩認証情報使用試行の確認方法

過去7日間における漏洩認証情報の使用試行回数は、**Credential Stuffing**セクションに表示されます。カウンターをクリックすると、過去7日間のすべての[`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type)攻撃が表示される**Attacks**セクションにリダイレクトされます。

攻撃を展開すると、漏洩したパスワードを持つログイン情報のリストを確認できます。

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## 漏洩認証情報のCSVリストの取得

全体の漏洩認証情報の数は、**Credential Stuffing**セクションに表示されます。カウンターをクリックすると、CSVファイルが自動的にダウンロードされ、漏洩認証情報のリストが取得されます。

## 通知の受信

漏洩認証情報の使用試行に関する即時通知を、メール、メッセンジャー、または[統合済みシステム](../user-guides/settings/integrations/integrations-intro.md)に受信することができます。そのような通知を有効化するには、Wallarm Consoleの**Triggers**セクションで、**Compromised user account**条件を設定したトリガーを1つ以上構成してください。

通知は、監視したいアプリケーションやホスト、及びレスポンスタイプによって絞り込むことができます。

**トリガー例: Slackへ漏洩認証情報使用試行の通知**

この例では、新たに漏洩認証情報使用試行が検出された場合、設定済みのSlackチャンネルへその旨の通知が送信されます。

![クレデンシャルスタッフィングトリガー](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**トリガーのテスト方法:**

1. Wallarm Console→**Integrations**にアクセスし、[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウド上で[Slackとの統合](../user-guides/settings/integrations/slack.md)を設定します。
1. **Credential Stuffing**セクションでクレデンシャルスタッフィングが有効化され、**Recommended endpoints**からWallarmが定義した以下のルールがアクティブな**Authentication endpoints**に追加されていることを確認します:

    リクエストは以下の通りです:

    ```
    /**/{{login|auth}}.*
    ```

    パスワードは以下の場所にあります:

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    ログインは以下の場所にあります:

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. **Triggers**セクションで、上記のようにトリガーを作成し、ご自身のSlack統合にマッピングしてください。
1. ノードの`localhost/login`エンドポイントに、漏洩認証情報を含むリクエストを送信します:

    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```

1. **Attacks**セクションで、リクエストが`credential_stuffing`タイプのイベントとして登録されていることを確認してください。
1. 攻撃を展開し、漏洩したログイン情報が含まれていることを確認してください。
1. Slackチャンネルのメッセージを確認します。新規メッセージは以下のようになります:
    ```
    [wallarm] Stolen credentials detected
    
    Notification type: compromised_logins

    Stolen credentials have been detected in your incoming traffic:

    Compromised accounts: user-01@company.com
    Associated URL: localhost/login
    Link: https://my.wallarm.com/attacks/?q=attacks+d%3Alocalhost+u%3A%2Flogin+statuscode%3A404+application%3Adefault+credential_stuffing+2024%2F01%2F22

    Client: YourCompany
    Cloud: EU
    ```

## 制限事項

現時点では、以下の方法でデプロイされたWallarmノードではクレデンシャルスタッフィング検出モジュールはサポートされていません:

* [Terraform module for AWS](../installation/cloud-platforms/aws/terraform-module/overview.md)
* [Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md)