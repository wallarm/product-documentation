# セキュリティエッジインライン <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

**Security Edge** プラットフォームは、Wallarmがホストする環境内の地理的に分散したロケーションにWallarmノードを展開するためのマネージドサービスを提供します。その主要な展開オプションの一つである**inline**展開では、オンサイトでのインストールを必要とせず、API全体に対してリアルタイムで堅牢な保護を実現します。

これは、DNS設定のCNAMEレコードを変更してホストからWallarmのエッジノードへトラフィックをリダイレクトできる場合、API保護に最適なソリューションです。

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## 動作の仕組み

Security Edgeサービスは、安全なクラウド環境を提供し、WallarmノードをWallarmが展開、ホスト、管理します：

* ターンキー展開：Wallarmが世界各地に分散したロケーションにノードを自動展開するため、最小限のセットアップで済みます。
* オートスケーリング：ノードはトラフィック負荷に応じて水平方向に自動スケールし、手動設定は不要です。
* コスト削減：Wallarmが管理するノードにより運用負荷が軽減され、迅速な展開とスケーラビリティが実現します。
* シームレスな統合：シンプルな設定でAPI全体を中断することなく保護できます。

## 制限事項

* 現在、エッジinlineノードは直接的なインターネット向け展開のみをサポートします。CDNやDDoS保護プロバイダー（例: Cloudflare, Akamai）など、トラフィックをルーティングするサードパーティサービスの背後では動作しません。
* 対応するドメインは、3レベル以上のみです（例: `domain.com`ではなく`www.domain.com`を使用してください）。
* 64文字未満のドメインのみがサポートされます。
* HTTPSトラフィックのみがサポートされ、HTTPは許可されません。
* エッジノードの展開を開始するには、証明書のCNAMEレコードを追加する必要があります。
* 証明書のCNAMEが14日以内に追加されない場合、ノードの展開が失敗します。

## エッジインラインの設定

エッジインラインを実行するには、Wallarm Consoleの **Security Edge** → **Edge inline** → **Configure** に移動してください。複数のオリジンを設定してトラフィックを転送し、複数のホストを保護できます。

このセクションが利用できない場合、お使いのアカウントに適切なサブスクリプションがない可能性があります。sales@wallarm.comまでお問い合わせください。

エッジノードの展開設定はいつでも更新可能です。既存のCNAMEレコードは変更せずにノードが再展開されます。

### 1. 一般設定

一般設定では、エッジノードを展開するリージョンと、フィルタリングされたトラフィックを転送するオリジンを指定します。

#### リージョン

エッジノードを展開するリージョンを1つ以上選択してください。APIやアプリケーションがホストされている場所に近いリージョンの選択を推奨します。

複数のリージョンで展開することで、地理的な冗長性が向上し、高い可用性が確保されます。

#### オリジンサーバー

エッジノードがフィルタリングされたトラフィックを転送する対象となるオリジンを指定してください。各オリジンには、サーバーのIPアドレス、ドメイン名、またはFQDNを、オプションでポート番号（デフォルトは443）とともに指定します。

1つのオリジンに複数のサーバーがある場合、それらすべてを指定できます。リクエストは以下の方法で分散されます：

* ラウンドロビンアルゴリズムが使用されます。最初のリクエストは最初のサーバーに送信され、2つ目は次のサーバーに送信されるというように、最後のサーバーの後は再び最初のサーバーに戻ります。
* IPベースのセッション永続化により、同一IPからのトラフィックは常に同じサーバーにルーティングされます。

!!! info "Wallarm IPレンジからのトラフィックをオリジンで許可する"
    選択したリージョンで使用されるIPレンジからの受信トラフィックを、オリジンで許可してください：
    
    === "us-east-1"
        ```
        18.215.213.205
        44.214.56.120
        44.196.111.152
        ```
    === "us-west-1"
        ```
        52.8.91.20
        13.56.117.139
        54.177.237.34
        50.18.177.184
        ```
    === "eu-central-1 (Frankfurt)"
        ```
        18.153.123.2
        18.195.202.193
        3.76.66.246
        3.79.213.212
        ```
    === "eu-central-2 (Zurich)"
        ```
        51.96.131.55
        16.63.191.19
        51.34.0.90
        51.96.67.145
        ```

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

後にトラフィックの分析とフィルタリングのためにホストを追加する際、各ホストまたはlocationに指定されたオリジンを割り当てます。

### 2. 証明書

オリジンへ安全にトラフィックを誘導するため、Wallarmはドメインの証明書を取得する必要があります。これらの証明書は、**Certificates**セクションで指定したDNSゾーンに基づいて発行されます。

設定が完了すると、各DNSゾーンに対してWallarmがCNAMEを提供します。このCNAMEレコードをDNS設定に追加することで、ドメイン所有権を確認し、証明書発行プロセスを完了します。

![!](../../images/waf-installation/security-edge/inline/certificates.png)

### 3. ホスト

**Hosts**セクションでは：

1. Wallarmノードへ分析のためにトラフィックを誘導するドメインとポート、または任意のサブドメインを指定します。各ホストエントリは、**Certificates**で以前に定義されたDNSゾーンと一致する必要があります。

    ??? info "許可されるポート"
        HTTPポートからエッジノードへトラフィックを誘導することはできません。以下のポートがサポートされます：
        
        * 443
        * 1024–49151 (except: 9000, 9003, 9010, 9113, 9091, 9092, 18080)

1. （任意）ホストのトラフィックを[Wallarm application](../../user-guides/settings/applications.md)に関連付け、Wallarmプラットフォーム上の異なるAPIインスタンスやサービスを分類および管理します。
1. 各ホストに対して[Wallarm mode](../../admin-en/configure-wallarm-mode.md)を設定します。
1. 各ホストからフィルタリングされたトラフィックを転送するオリジンを選択します。

![!](../../images/waf-installation/security-edge/inline/hosts.png)

ホスト内の特定の**locations**について、さらにカスタマイズ可能です：

* オリジン。このlocationで定義されたパスは自動的にオリジンに追加されます。
* Wallarm application。
* フィルトレーションモード。
* 一部の[NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)も設定可能です。デフォルトでは、これらのディレクティブはNGINXの標準値（NGINXのドキュメントに記載）を使用します。

各locationはホストレベルの設定を継承しますが、個別にカスタマイズ可能です。明示的に設定されていないlocationは、ホストレベルで指定された一般設定に従います。

以下の例では、各パスごとに特定の要件に合わせた設定をカスタマイズしています。`/auth`はブロッキングモードを有効にすることでセキュリティを優先し、`/data`は`client_max_body_size`を5MBに増加させることで大容量アップロードを可能にしています。

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. （任意）管理者設定

**Admin settings**セクションでは、展開するエッジノードのバージョンを選択できます。明示的に選択しない場合、利用可能な最新バージョンが自動的に展開されます。

バージョンの変更履歴については[記事](../../updating-migrating/node-artifact-versions.md#all-in-one-installer)を参照してください。エッジノードのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`の形式に従い、リンク先の記事のバージョンと同じです。エッジノードのバージョンに含まれるビルド番号は小規模な変更を示します。

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

### 5. 証明書CNAMEの設定

設定が完了したら、各DNSゾーンに対してWallarm Consoleで提供されたCNAMEレコードをDNSプロバイダーの設定に追加してください。これらのレコードは、Wallarmがドメインの所有権を確認し証明書を発行するために必要です。

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

例として、DNSゾーンに`myservice.com`が指定されている場合、CNAMEは以下の通りです：

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.aws.wallarm-cloud.com
```

DNSの変更が反映されるまでに最大24時間かかる場合があります。CNAMEレコードの確認が完了すると、Wallarmはエッジノードの展開を開始します。

### 6. トラフィックルーティング用CNAMEの設定

証明書CNAMEの確認が完了すると（約10分）、各ホストの**Hosts**タブに**Traffic CNAME**が表示されます。これをコピーしてDNS設定を更新し、トラフィックをWallarmにルーティングしてください。

DNSの変更が反映されるまでに最大24時間かかる場合があります。反映されると、Wallarmはすべてのトラフィックをオリジンにプロキシし、不正なリクエストを軽減します。

## テレメトリポータル

セキュリティエッジインラインのテレメトリポータルは、Wallarmによって処理されたトラフィックのメトリクスに関するリアルタイムの洞察を提供するGrafanaダッシュボードを備えています。

ダッシュボードには、総処理リクエスト数、RPS、検出およびブロックされた攻撃、展開されたエッジノードの数、リソース消費、5xxレスポンスの数などの主要なメトリクスが表示されます。

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

**Run telemetry portal**は、ノードが**Active**状態に達すると実行されます。開始から約5分後にSecurity Edgeセクションの直接リンクを介してアクセス可能になります。

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

## エッジインラインのアップグレード

最新の変更を適用してエッジノードをアップグレードするには、**Configure** → **Admin settings** に移動し、リストからバージョンを選択してください。最適なパフォーマンスとセキュリティを得るため、最新バージョンの使用を推奨します。

バージョンの変更履歴については[記事](../../updating-migrating/node-artifact-versions.md#all-in-one-installer)を参照してください。エッジノードのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`の形式に従い、リンク先の記事のバージョンと同じです。エッジノードのバージョンに含まれるビルド番号は小規模な変更を示します。

## エッジインラインの削除

エッジ展開を削除するには、**Configure** → **Admin settings** → **Delete** をクリックしてください。

ノードを削除して再作成する場合、既存の展開設定を調整すると、ノードは更新された設定で再展開されます。

## ステータス

エッジノードセクションでは、オリジン、ホスト、リージョンの展開および設定状態のリアルタイムなステータスを提供します：

=== "ホスト"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "オリジン"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "リージョン"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)

* **Pending cert CNAME**：証明書発行のためにDNSに証明書CNAMEレコードが追加されるのを待機中です。
* **Pending traffic CNAME**：展開は完了しましたが、トラフィックをエッジノードにルーティングするためのTraffic CNAMEレコードの追加を待っています。
* **Deploying**：エッジノードは現在セットアップ中で、まもなく利用可能になります。
* **Active**：エッジノードは完全に稼働しており、設定に基づいてトラフィックをフィルタリングしています。
* **Cert CNAME error**：DNS内で証明書CNAMEの確認に問題がありました。CNAMEが正しく設定されているか確認してください。
* **Deployment failed**：証明書CNAMEが14日以内に追加されなかったなどの理由でエッジノードの展開に失敗しました。設定を確認し再展開するか、[Wallarm Support team](https://support.wallarm.com)にお問い合わせください。
* **Degraded**：エッジノードはリージョンで稼働していますが、機能が限定されるか、軽微な問題が発生している可能性があります。お手数ですが、[Wallarm Support team](https://support.wallarm.com)にお問い合わせください。