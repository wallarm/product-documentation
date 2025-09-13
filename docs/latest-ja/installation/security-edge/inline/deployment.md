# Security Edgeインラインデプロイ <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Wallarmの[インライントラフィック解析用Security Edge](overview.md)をデプロイするには、本ガイドに従います。

## 要件

* [Security Edgeサブスクリプション](../../../about-wallarm/subscription-plans.md)（無料または有料）
* ドメインのDNSレコードを編集して所有権を確認し、トラフィックをWallarmにルーティングできること

## 構成フロー

Edgeをインラインで稼働させるには、Wallarm Console → Security Edge → Inline → Configureに移動します。このセクションが利用できない場合は、必要なサブスクリプションへのアクセスについてsales@wallarm.comに連絡してください。

Free Tierでは、[Quick setup](../free-tier.md)でEdge Nodeをデプロイした後、Security Edgeセクションで設定を調整できます。

Edge Nodeのデプロイ設定はいつでも更新できます。ノードは再デプロイされますが、既存のCNAMEおよびAレコードは変更されません。

構成フロー全体のデモをご覧ください:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
    </div>

## 1. プロバイダーとリージョン

Edge Nodeをデプロイするリージョン（AWSまたはAzure）を1つ以上選択します。レイテンシー最適化のため、APIに近いロケーションを選択します。

利用可能なリージョンは使用中の[Wallarm Cloud](../../../about-wallarm/overview.md#cloud)に依存します（US→米国リージョン、EU→EUリージョン）。

[マルチリージョン・マルチクラウドデプロイの詳細](multi-region.md)

## 2. オリジン

Edge Nodeがフィルタ済みトラフィックを転送するオリジンを指定します。各オリジンには、サーバーのIPアドレスまたはFQDNにオプションのポート（デフォルト: 443）を付けて指定します。

オリジンに複数サーバーがある場合は、すべてを指定できます。リクエストは次のように分散されます。

* [ラウンドロビン](https://en.wikipedia.org/wiki/Round-robin_DNS)アルゴリズムを使用します。最初のリクエストは最初のサーバーへ、2番目は次のサーバーへというように送信され、最後のサーバーの後は最初に戻ります。
* IPベースのセッション永続化により、同一IPからのトラフィックは常に同じサーバーにルーティングされます。

**オリジンへのアクセスの保護**

信頼できるトラフィックのみに限定するには、次のいずれかの方法でEdge Nodeからの接続を許可します。

* （推奨）[mTLS](mtls.md)でEdge Nodeを認証します。これにより、WallarmのIPが変更された場合の問題を回避できます。
* 選択したデプロイリージョンのIPレンジからのトラフィックのみを許可します（IPは変更される場合があります）。

    ??? info "WallarmのIPレンジを表示"
        * AWS

            === "米国東部1"
                ```
                18.215.213.205
                44.214.56.120
                44.196.111.152
                ```
            === "米国西部1"
                ```
                52.8.91.20
                13.56.117.139
                54.177.237.34
                50.18.177.184
                ```
            === "EU中部1（フランクフルト）"
                ```
                18.153.123.2
                18.195.202.193
                3.76.66.246
                3.79.213.212
                ```
            === "EU中部2（チューリッヒ）"
                ```
                51.96.131.55
                16.63.191.19
                51.34.0.90
                51.96.67.145
                ```

        * Azure

            === "米国東部2"
                ```
                20.65.88.253
                20.65.88.252
                ```
            === "米国西部3"
                ```
                20.38.2.233
                20.38.2.232
                ```
            === "ドイツ西部中部"
                ```
                20.79.250.104
                20.79.250.105
                ```
            === "スイス北部"
                ```
                20.203.240.193
                20.203.240.192
                ```

![!](../../../images/waf-installation/security-edge/inline/general-settings-section.png)

## 3. 証明書

* Edge Inline Nodeをインターネットに直接公開するソリューションとしてデプロイする場合、オリジンサーバーへのトラフィックを安全にルーティングするために証明書が必要です。証明書は、このセクションで指定したDNSゾーンに基づいて発行されます。

    構成が完了すると、Wallarmは各DNSゾーンに対してCNAMEを提供します。ドメイン所有権を確認し証明書発行プロセスを完了するため、DNS設定にこのCNAMEレコードを追加します。
* トラフィックをプロキシするサードパーティサービス（例: CDNやCloudflareやAkamaiのようなDDoS保護プロバイダー）の背後にオリジンサーバーがある場合、証明書の発行は不要です。この場合、**Skip certificate issuance**オプションを選択します。

![!](../../../images/waf-installation/security-edge/inline/certificates.png)

複数のDNSゾーンを指定でき、それぞれで異なる証明書発行アプローチを選択できます。

!!! info "CAAレコード"
    一部の組織では、どの認証局（CA）が自社ドメインの証明書を発行できるかを制限するためにDNSの[CAA](https://letsencrypt.org/docs/caa/)レコードを使用しています。

    CAAレコードを管理している場合は、Let's EncryptをWallarm Account ID付きで許可してください。そうしないとSecurity Edge用の証明書を発行できません。

    ```
    0 issue "letsencrypt.org;validationmethods=dns-01;accounturi=https://acme-v02.api.letsencrypt.org/acme/acct/2513765531"
    ```

    現在のCAAレコードは次で確認できます。

    ```
    dig +short CAA your-domain.com
    ```

## 4. ホスト

Edge Nodeで解析するためにトラフィックを向ける公開ドメイン、ポート、サブドメインを指定します。

!!! info "Apexドメイン"
    可能であればapexドメインの代わりに`www.example.com`を使用します。あるいは、[apexドメインから`www.*`へのリダイレクト](host-redirection.md#recommended-redirect-from-apex-domain-to-www)を構成します。これによりWallarmがグローバルCNAMEを使用でき、Aレコードでの手動のトラフィック分散を回避できます。

1. ホストを指定します。各ホストエントリは（**Certificates**セクションで指定されている場合は）DNSゾーンと一致し、ルーティングループを避けるためにオリジンとは異なる必要があります。

    ??? note "許可されるポート"
        HTTPポートからEdge Nodeへトラフィックを向けることはできません。次のポートがサポートされます。

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, and 60000
1. （任意）そのホストのトラフィックを[Wallarmアプリケーション](../../../user-guides/settings/applications.md)に関連付け、Wallarmプラットフォーム上で異なるAPIインスタンスやサービスを分類・管理します。
1. 各ホストの[Wallarm mode](../../../admin-en/configure-wallarm-mode.md)を設定します。
1. （任意）[サーバーレベルのNGINXディレクティブ](nginx-overrides.md#server-level-directives)をカスタマイズします。デフォルトは標準のNGINX値に従います。
1. 各ホストについて、ルートロケーション（`/`）の構成を定義します。

    * [オリジン](#2-origins)：他のロケーション固有の設定がない場合にWallarm Nodeがフィルタ済みトラフィックを転送する送信先です。ロケーションのパスは自動的にオリジンに付加されます。
    * （任意）Wallarmアプリケーション。
    * フィルタリングモード。

![!](../../../images/waf-installation/security-edge/inline/hosts.png)

ホスト内の特定の**ロケーション**ごとに、さらに次をカスタマイズできます。

* オリジン。ロケーションで定義したパスは自動的にオリジンに付加されます。
* Wallarmアプリケーション。
* フィルタリングモード。
* [ロケーションレベルのNGINXディレクティブ](nginx-overrides.md#location-level-directives)。デフォルトは標準のNGINX値に従います。

各ロケーションは、明示的に上書きしない限り、ホストおよびルートロケーションの設定を継承します。

以下のサンプル構成では、パスごとに設定を調整して要件に対応しています。`/auth`はブロッキングモードを有効にしてセキュリティを優先し、`/data`は`client_max_body_size`を5MBに引き上げて大きなアップロードを許可します。

![!](../../../images/waf-installation/security-edge/inline/locations.png)

## 5. 証明書用CNAMEの設定

ドメインの検証のため、Wallarm Consoleで提供されるCNAMEレコードを各DNSゾーンについてDNSプロバイダーの設定に追加します。これらのレコードは、Wallarmがドメインの所有権を確認し証明書を発行するために必要です。

!!! warning "証明書用CNAMEを削除しないでください"
    証明書用CNAMEレコードはDNS設定に残しておく必要があります。これは以後のデプロイ構成更新や証明書の更新に必要です。

![](../../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../../images/waf-installation/security-edge/inline/cert-cname.png)

DNSの変更が反映されるまで最大24時間かかる場合があります。CNAMEレコードが検証されると（必要な場合）、WallarmはEdge Nodeのデプロイを開始します。

## 6. Edge Nodeへのトラフィックルーティング

クライアントリクエストをEdge Node経由にするため、保護対象のドメイン種別に応じてDNSレコードを更新します。

### CNAMEレコード

保護対象のホストが第3レベル（またはそれ以上）のドメイン（例: `api.example.com`）の場合、DNSゾーンにWallarm提供のFQDNを指すCNAMEレコードを指定する必要があります。

証明書用CNAMEが検証されると、各ホストに対して**Traffic CNAME**が利用可能になります。証明書を発行しない場合は、構成完了直後にCNAMEが利用可能です。

* シングルクラウドデプロイ: 選択したクラウドプロバイダー用の**Traffic CNAME**を使用します。
* マルチクラウドデプロイ: **Traffic CNAME (Global)**を使用して、選択したすべてのリージョンとプロバイダーに自動的にトラフィックを分散します。

    プロバイダーごとのCNAMEも利用でき、特定プロバイダーへのルーティングを強制する必要がある場合（例: プロバイダー間のレイテンシーやパフォーマンスをテストする場合）に使用できます。

![](../../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNSの変更が反映されるまで最大24時間かかる場合があります。反映後、Wallarmはすべてのトラフィックを構成済みのオリジンにプロキシします。

### Aレコード

保護対象のホストがapexドメイン（例: `example.com`）の場合、CNAMEは使用できません。この場合、DNSセットアップは**Aレコード**を使用する必要があり、デプロイが[**Active**](upgrade-and-management.md#statuses)になると返されます。

![](../../../images/waf-installation/security-edge/inline/a-records.png)

この場合のトラフィックルーティングはDNSプロバイダー側で管理されます。デフォルトでは多くのDNSプロバイダーが[ラウンドロビン](https://en.wikipedia.org/wiki/Round-robin_DNS)方式を使用しますが、プロバイダーによってはレイテンシーベースのルーティングにも対応しています。

## その他の構成オプション

* [複数リージョン・複数プロバイダーでのEdge Nodeデプロイ](multi-region.md)
* [Edge NodeからオリジンへのmTLS](mtls.md)
* [ホストのリダイレクト](host-redirection.md)
* [カスタムブロックページ](custom-block-page.md)
* [NGINXの上書き設定](nginx-overrides.md)
* [Edge Nodeのアップグレード](upgrade-and-management.md)
* [テレメトリポータル](telemetry-portal.md)