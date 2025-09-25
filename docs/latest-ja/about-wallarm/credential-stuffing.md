# クレデンシャルスタッフィング検知 <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[クレデンシャルスタッフィング](../attacks-vulns-list.md#credential-stuffing)は、攻撃者が漏えいしたユーザー認証情報のリストを用いて、複数のWebサイト上のユーザーアカウントへ不正アクセスするサイバー攻撃です。この記事では、Wallarmの**Credential Stuffing Detection**を使用してこの種の脅威を検知する方法について説明します。

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/sz9nukwy2hx4" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

クレデンシャルスタッフィング攻撃は、複数のサービスで同一のユーザー名とパスワードを使い回す慣行が広く存在し、さらに推測されやすい（弱い）パスワードを選びがちであることから、特に危険です。成功に必要な試行回数が少ないため、攻撃者はリクエストの送信頻度を大幅に下げられ、このためブルートフォース防御のような標準的な対策が効果を発揮しにくくなります。

## Wallarmによるクレデンシャルスタッフィングへの対処

Wallarmの**Credential Stuffing Detection**は、漏えいまたは弱い認証情報を使ってお客様のアプリケーションへアクセスしようとする試行に関するリアルタイム情報を収集・表示します。また、これらの試行に関する即時通知を有効化できるほか、お客様のアプリケーションへのアクセスに使用されたすべての漏えいまたは弱い認証情報のダウンロード可能な一覧を作成します。

漏えいおよび弱いパスワードの特定には、公開されている[HIBP](https://haveibeenpwned.com/)の漏えい認証情報データベースから収集した、**8億5,000万件以上**の包括的データベースを使用します。

![クレデンシャルスタッフィング - スキーマ](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

WallarmのCredential Stuffing Detectionは、以下の手順により認証情報データの安全性を保ちます。

1. リクエストがノードに到達すると、パスワードから[SHA-1](https://en.wikipedia.org/wiki/SHA-1)を生成し、そのうちの数文字をCloudに送信します。
1. Cloudは既知の漏えいパスワードのデータベースを、受信した文字列で始まるものがないか確認します。該当があれば、SHA-1で暗号化された形式でノードに送信され、ノードはそれらをリクエストのパスワードと照合します。
1. 一致した場合、ノードはCloudにクレデンシャルスタッフィング攻撃として報告し、リクエストから取得したログインを攻撃情報に含めます。
1. ノードはリクエストをアプリケーションに転送します。

したがって、Wallarmノードを搭載したマシンからWallarm Cloudへパスワードが暗号化されない状態で送信されることはありません。認証情報は同時に送信されないため、お客様のネットワーク内でクライアントの認可データが安全に保たれます。

**大量試行と単発試行**

Credential Stuffing Detectionは、ボットによる大量の漏えい認証情報使用試行と、他の手段では検知できない単発の試行の両方を記録できます。

**緩和策**

盗まれた、または弱いパスワードを持つアカウントを把握することで、アカウント所有者への連絡や一時的なアクセス停止など、これらのアカウントのデータを保護するための措置を開始できます。

パスワードが弱い、または漏えいしている場合でも正当なユーザーを誤ってブロックしないよう、Wallarmは漏えい認証情報を含むリクエストをブロックしません。ただし、次の場合にはクレデンシャルスタッフィングの試行をブロックできる点にご注意ください。

* 悪意のあるボット活動として検出された一連の行為に含まれており、[API Abuse Prevention](../api-abuse-prevention/overview.md)モジュールを有効にしている場合。
* 他の[攻撃兆候](../attacks-vulns-list.md)を伴うリクエストの一部である場合。

## 有効化

Wallarmの**Credential Stuffing Detection**を有効にするには、次の手順に従います。

1. ご利用の[サブスクリプションプラン](../about-wallarm/subscription-plans.md#core-subscription-plans)に**Credential Stuffing Detection**が含まれていることを確認します。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.)にリクエストを送信します。
1. Wallarmノードが[バージョン4.10](../updating-migrating/what-is-new.md)以上であり、以下のいずれかのアーティファクトでデプロイされていることを確認します。
    * [オールインワンインストーラー](../installation/nginx/all-in-one.md)
    * [NGINXベースのIngressコントローラー向けHelmチャート](../admin-en/installation-kubernetes-en.md)
    * [NGINXベースのDockerイメージ](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
1. ご利用のユーザー[ロール](../user-guides/settings/users.md#user-roles)に**Credential Stuffing Detection**の設定権限があることを確認します。
1. Wallarm Console → **Credential Stuffing**で、この機能を有効にします（初期状態では無効です）。

**Credential Stuffing Detection**を有効化したら、動作を開始するために[設定](#configuring)が必要です。

## Configuring

漏えいした認証情報の使用試行を検査する対象となる認証エンドポイントの一覧を作成する必要があります。一覧を作成するには、Wallarm Console → **Credential Stuffing**に移動します。

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

エンドポイントを一覧に追加する方法は2通りあります。

* **Recommended endpoints**一覧から追加する方法です。この一覧には次の2種類の要素が含まれます。
    * 一般的に使用される認証エンドポイントと、その中でパスワードとログインを格納するパラメータを指定するための正規表現を用いた、Wallarmの事前定義ルール。
    <!--
        ![Credential Stuffing - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * [API Discovery](../api-discovery/overview.md)モジュールによって検出され、実際にトラフィックを受信したと記録された認証に使用されるエンドポイント。
* 手動で追加する方法です。独自の認証エンドポイントを含めることで、すべてを網羅して保護できます。手動で追加する場合は、[URI](../user-guides/rules/rules.md#uri-constructor)と、認証パラメータの検索方法を設定します。
    * By **Exact location of parameters** - パスワードとログインが存在する正確なエンドポイントの[リクエストポイント](../user-guides/rules/rules.md#configuring)を指定します。
    <!--
        ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * By **Regular expression** - パスワードとログインを含むエンドポイントのパラメータを[正規表現](../user-guides/rules/rules.md#condition-type-regex)で検索します。
    
        ![Credential Stuffing - Add authentication endpoint - Regular expression](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## 漏えい認証情報の使用試行の表示

過去7日間における漏えい認証情報の使用試行の回数は、**Credential Stuffing**セクションに表示されます。カウンターをクリックすると、**Attacks**セクションに移動し、過去7日間のすべての[`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type)攻撃が表示されます。

いずれかの攻撃を展開すると、パスワードが漏えいしているログインの一覧を確認できます。

![Attacks - クレデンシャルスタッフィング](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## 漏えい認証情報のCSVリストの取得

漏えい認証情報の総数は**Credential Stuffing**セクションに表示されます。カウンターをクリックすると、ブラウザーが漏えい認証情報の一覧を含むCSVファイルをダウンロードします。

## 通知の受信

漏えい認証情報の使用試行に関する即時通知を、メール、メッセンジャー、または[統合済みシステム](../user-guides/settings/integrations/integrations-intro.md)のいずれかで受け取れます。このような通知を有効にするには、Wallarm Consoleの**Triggers**セクションで、条件**Compromised user account**を使用するトリガーを1つ以上構成します。

監視対象のアプリケーションやホスト、応答タイプで通知を絞り込むこともできます。

**トリガー例: Slackでの漏えい認証情報使用試行の通知**

この例では、漏えい認証情報の新たな使用試行が検出された場合、設定済みのSlackチャンネルに通知が送信されます。

![クレデンシャルスタッフィングのトリガー](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**トリガーをテストするには:**

1. Wallarm Console → **Integrations**で、[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドにアクセスし、[Slackとの連携を設定](../user-guides/settings/integrations/slack.md)します。
1. **Credential Stuffing**セクションで、Credential Stuffingが有効になっていること、また、以下のWallarmの事前定義ルールが**Recommended endpoints**から有効な**Authentication endpoints**に追加されていることを確認します。

    Request is:

    ```
    /**/{{login|auth}}.*
    ```

    Password is located here:

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    Login is located here:

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. **Triggers**セクションで、上記のとおりトリガーを作成し、ご自身のSlack連携にマッピングします。
1. 漏えい認証情報を含むリクエストをノードの`localhost/login`エンドポイントに送信します。
    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```
1. **Attacks**セクションで、リクエストが`credential_stuffing`タイプのイベント（漏えい認証情報の使用試行）として登録されていることを確認します。 
1. 攻撃を展開し、漏えいしたログイン情報が含まれていることを確認します。
1. Slackチャンネルのメッセージを確認します。新しいメッセージは次のようになります:
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

現在、AWS向け[Terraformモジュール](../installation/cloud-platforms/aws/terraform-module/overview.md)でデプロイされたWallarmノードでは、Credential Stuffing Detectionモジュールはサポートされていません。