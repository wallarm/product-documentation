# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edgeプラットフォームは、Wallarmがホストする環境内の地理的に分散したロケーションにWallarmノードをデプロイするためのマネージドサービスを提供します。主要なデプロイメントオプションの1つであるinlineデプロイメントは、オンサイトのインストールを一切必要とせず、API全体をリアルタイムかつ堅牢に保護します。

これは、DNS設定のCNAMEレコードを変更してホストからWallarmのEdgeノードへトラフィックをリダイレクトできる場合に、APIを保護する理想的なソリューションです。

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## 仕組み

Security Edgeサービスは、WallarmノードがWallarmによってデプロイ、ホスト、管理される安全なクラウド環境を提供します:

* ターンキー型デプロイメント：最小限のセットアップで、Wallarmが地理的に分散したロケーションへ自動的にノードをデプロイします。
* オートスケーリング：変動するトラフィック負荷に対応するためにノードが自動的に水平スケールし、手動の設定は不要です。
* コスト削減：Wallarm管理のノードにより運用負荷を低減し、迅速なデプロイとスケーラビリティを実現します。
* シームレスな統合：シンプルな設定で、サービスを停止させることなくAPI全体を保護できます。

## 制限事項

* 第3レベル以上のドメインのみ対応します（例: domain.comではなくwww.domain.comを使用します）。
* 64文字未満のドメインのみ対応します。
* HTTPSトラフィックのみ対応します。HTTPは許可されません。
* [カスタムブロックページとブロックコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の構成にはまだ対応していません。

## Edge Inlineの設定

Edge inlineを実行するには、Wallarm Console → Security Edge → Edge inline → Configureに移動します。このセクションが利用できない場合は、必要なサブスクリプションへのアクセスについてsales@wallarm.comへお問い合わせください。

転送先となる複数のオリジンと、保護する複数のホストを設定できます。デモをご覧ください:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

Edgeノードのデプロイ設定はいつでも更新できます。既存のCNAMEレコードは変更せずに、ノードは再デプロイされます。

### 1. General settings

General settingsでは、Edgeノードをデプロイするリージョンと、フィルタ済みトラフィックの転送先オリジンを指定します。

#### Regions

Edgeノードをデプロイするリージョンを1つ以上選択します。APIやアプリケーションのホスト場所に近いリージョンを選択することを推奨します。

複数のリージョンにデプロイすると、ジオ冗長性が向上し、高可用性を確保できます。

#### Origin servers

Edgeノードがフィルタ済みトラフィックを転送するオリジンを指定します。各オリジンには、サーバーのIPアドレスまたはFQDNと、任意のポート（デフォルト: 443）を指定します。

オリジンが複数のサーバーを持つ場合は、すべて指定できます。リクエストは次のように分散されます:

* ラウンドロビンアルゴリズムを使用します。最初のリクエストは最初のサーバーに、2番目は次のサーバーに送られ、最後のサーバーの後は最初のサーバーに戻ります。
* IPベースのセッション永続性により、同一IPからのトラフィックは常に同じサーバーへルーティングされます。

!!! info "オリジンでWallarmのIPレンジからのトラフィックを許可する"
    選択したリージョンで使用されるIPレンジからの着信トラフィックを、オリジンで許可する必要があります:

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

後で、トラフィックの分析とフィルタリング対象のホストを追加する際に、各ホストまたはロケーションを所定のオリジンに割り当てます。

### 2. Certificates

Certificatesセクションでは、ドメイン向けの証明書を取得できます:

* Edge Inlineノードをインターネットに直接面するソリューションとしてデプロイする場合、オリジンサーバーへトラフィックを安全にルーティングするために証明書が必要です。証明書は、このセクションで指定したDNSゾーンに基づいて発行されます。

    構成が完了すると、Wallarmは各DNSゾーンに対するCNAMEを提供します。ドメイン所有権の確認と証明書発行プロセスの完了のため、このCNAMEレコードをDNS設定に追加します。
* オリジンサーバーがトラフィックをプロキシするサードパーティサービス（例: CDN、CloudflareやAkamaiのようなDDoS保護プロバイダー）の背後にある場合、証明書の発行は不要です。この場合、Skip certificate issuanceオプションを選択します。

![!](../../images/waf-installation/security-edge/inline/certificates.png)

複数のDNSゾーンを指定でき、ゾーンごとに異なる証明書発行方式を選択できます。

### 3. Hosts

Hostsセクションでは:

1. Wallarmノードで分析するためにトラフィックを向けるドメイン、ポート、サブドメインを指定します。各ホストエントリは、事前にCertificatesで定義したDNSゾーンに一致している必要があります。

    ??? info "許可されるポート"
        HTTPポートからエッジノードへトラフィックを誘導することはできません。以下のポートがサポートされます：
        
        * 443
        * 1024–49151 (except: 9000, 9003, 9010, 9113, 9091, 9092, 18080)

1. （任意）ホストのトラフィックを[Wallarmアプリケーション](../../user-guides/settings/applications.md)に関連付け、Wallarmプラットフォーム上で異なるAPIインスタンスやサービスを分類・管理します。
1. 各ホストの[Wallarm mode](../../admin-en/configure-wallarm-mode.md)を設定します。
1. （任意）サーバーの[NGINXディレクティブ](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)を指定します。デフォルトでは、これらのディレクティブはNGINXドキュメントに記載された標準値を使用します。
1. 各ホストについて、ルートロケーション（`/`）の設定を定義します:

    * （他のロケーション固有の設定が定義されていない場合に）Wallarmノードがフィルタ済みトラフィックを転送するオリジン。ロケーションで定義したパスは自動的にオリジンに付加されます。
    * （任意）Wallarmアプリケーション。
    * フィルタリングモード。

![!](../../images/waf-installation/security-edge/inline/hosts.png)

ホスト内の特定のロケーションについて、さらに次をカスタマイズできます:

* オリジン。ロケーションで定義したパスは自動的にオリジンに付加されます。
* Wallarmアプリケーション。
* フィルタリングモード。
* 一部の[NGINXディレクティブ](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)。デフォルトでは、これらのディレクティブはNGINXドキュメントに記載された標準値を使用します。

各ロケーションは、明示的に上書きしない限り、ホストおよびルートロケーションの設定を継承します。

以下の例では、要件に合わせてパスごとに設定をカスタマイズしています。`/auth`はブロッキングモードを有効にしてセキュリティを優先し、`/data`は`client_max_body_size`を5MBに増やすことで大きなアップロードを許可します。

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. (Optional) Admin settings

Admin settingsセクションでは、ノードのバージョンを選択し、アップグレードに関する設定を指定します:

* デプロイするEdgeノードのバージョンを選択します。デフォルトでは最新の利用可能なバージョンがデプロイされます。

    バージョンの変更履歴は[記事](../../updating-migrating/node-artifact-versions.md#all-in-one-installer)を参照してください。Edgeノードのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`の形式で、リンク先の記事の同一バージョンに対応します。Edgeノードのバージョンに含まれるビルド番号は軽微な変更を示します。
* 必要に応じて[Auto update](#upgrading-the-edge-inline)を有効にします。

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

### 5. 証明書CNAMEの設定

CertificatesセクションでDNSゾーンを指定した場合、Wallarm Consoleに表示されるCNAMEレコードを各DNSゾーンについてDNSプロバイダーの設定に追加します。これらのレコードは、Wallarmがドメイン所有権を確認し証明書を発行するために必要です。

!!! warning "証明書CNAMEを削除しないでください"
    証明書用のCNAMEレコードはDNS設定に残しておく必要があります。今後のデプロイ設定の更新や証明書の更新に必要です。

![](../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

例として、DNSゾーンに`myservice.com`を指定した場合、cert CNAMEは次のとおりです:

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.aws.wallarm-cloud.com
```

DNSの変更が反映されるまで最大24時間かかる場合があります。CNAMEレコードが検証されると、WallarmはEdgeノードのデプロイを開始します。

### 6. Edgeノードへのトラフィックルーティング

Edgeノードへトラフィックをルーティングするには、DNSゾーンにWallarmが提供するFQDNを指すCNAMEレコードを指定する必要があります。このレコードはTraffic CNAMEとして返されます。

証明書CNAMEが検証されると、各ホストに対してTraffic CNAMEが利用可能になります。証明書を発行しない場合は、構成完了直後にCNAMEが利用可能です。

![](../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNSの変更が反映されるまで最大24時間かかる場合があります。伝播後、Wallarmはすべてのトラフィックをプロキシします。

## Telemetry portal

Security Edge Inline向けのTelemetry portalは、Wallarmが処理したトラフィックに関するメトリクスをリアルタイムに可視化するGrafanaダッシュボードを提供します。

ダッシュボードには、総処理リクエスト数、RPS、検出・ブロックした攻撃、デプロイ済みEdgeノード数、リソース消費、5xx応答の数などの主要な指標が表示されます。

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

ノードがActiveステータスに達したら、**Run telemetry portal**を実行します。開始から約5分後に、Security Edgeセクションからのダイレクトリンク経由でアクセスできるようになります。

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

Grafanaのホームページからダッシュボードへ移動するには、Dashboards → Wallarm → Portal Inline Overviewに進みます。

## Upgrading the Edge Inline

Admin settingsでAuto updateを有効にすると、新しいマイナーまたはパッチバージョンがリリースされ次第（選択したオプションに応じて）、Edgeノードが自動的にアップグレードされます。初期設定はすべて保持されます。Auto updateはデフォルトでオフです。

Edgeノードを手動でアップグレードするには、Configure → Admin settingsに移動し、一覧からバージョンを選択します。最適なパフォーマンスとセキュリティのため、最新バージョンの使用を推奨します。

新しいメジャーバージョンへのアップグレードは手動でのみ実行できます。

バージョンの変更履歴は[記事](../../updating-migrating/node-artifact-versions.md#all-in-one-installer)を参照してください。Edgeノードのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`の形式で、リンク先の記事の同一バージョンに対応します。Edgeノードのバージョンに含まれるビルド番号は軽微な変更を示します。

## Edge Inlineの削除

Edgeデプロイを削除するには、Configure → Admin settings → Delete inlineをクリックします。

ノードを削除して再作成する予定がある場合は、既存のデプロイの設定を調整すると、更新された構成でノードが再デプロイされます。

サブスクリプションが期限切れになると、Edgeノードは14日後に自動的に削除されます。

## ステータス

Edge nodeセクションでは、オリジン、ホスト、リージョンのデプロイおよび構成状態のリアルタイムステータスを提供します:

=== "Hosts"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origins"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Regions"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "Nodes"
    **Nodes**タブでは、各Edgeノードの技術的な詳細を提供します。このビューは主にトラブルシューティング支援のためにWallarm Support teamが使用します。ノード数はトラフィック需要に依存し、Wallarmのオートスケーリングによって自動管理されます。

    ![!](../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**：証明書発行のためのCNAMEレコードが（該当する場合）DNSに追加されるのを待機しています。
* **Pending traffic CNAME**：デプロイメントが完了し、トラフィックをEdgeノードへルーティングするためのTraffic CNAMEまたはプロキシターゲットレコードの追加を待機しています。
* **Deploying**：Edgeノードのセットアップ中で、間もなく利用可能になります。
* **Active**：Edgeノードは完全に稼働しており、設定どおりにトラフィックをフィルタリングしています。
* **Cert CNAME error**：DNSで証明書CNAMEの検証に問題が発生しました。CNAMEが正しく構成されているか確認してください（該当する場合）。
* **Deployment failed**：Edgeノードのデプロイに失敗しました（例: 証明書CNAMEが14日以内に追加されなかった）。設定を確認して再デプロイを試すか、支援が必要な場合は[Wallarm Support team](https://support.wallarm.com)にお問い合わせください。
* **Degraded**：Edgeノードはそのリージョンで稼働していますが、機能が制限されている、または軽微な問題が発生している可能性があります。支援が必要な場合は[Wallarm Support team](https://support.wallarm.com)にお問い合わせください。

RPSおよびホスト・オリジンごとのリクエスト数は[バージョン](../../updating-migrating/node-artifact-versions.md#all-in-one-installer)5.3.0以降で返されます。