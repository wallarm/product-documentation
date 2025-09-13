# Security Edge Inlineにおけるホストリダイレクト <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Wallarm [Security Edge Inline](deployment.md)は、トラフィックのエントリポイントを統一するのに役立つホストリダイレクト機能を提供します。

## 動作の仕組み

ホストリダイレクトを有効にすると、Edge Nodeはクライアントリクエストをあるホスト（**リダイレクト元ホスト**）から別のホスト（**対象ホスト**）へ自動的にリダイレクトします。

リダイレクトされたリクエストは、その後、対象ホストの設定（origin、フィルタリングモード、その他の設定を含む）に従って処理されます。

!!! info "TLSの要件"
    リダイレクト元ホストのDNSゾーンで[証明書の発行が有効化されている](deployment.md#5-certificate-cname-configuration)必要があります。

![!](../../../images/waf-installation/security-edge/inline/host-redirection.png)

Edge Nodeは、リダイレクト元ホストへの受信リクエストに対してHTTP 301または302のリダイレクトで応答し、クライアントに対象ホスト上の同一リソースを要求するよう指示します。

リダイレクト時には元のパスとクエリ文字列が保持されます。

## ホストリダイレクトの有効化

ホストリダイレクトを有効化するには次の手順に従います:

1. 対象[ホスト](deployment.md#4-hosts)（クライアントリクエストのリダイレクト先となるホスト）を追加します。
1. 必要なorigin、フィルタリングモード、その他の設定で完全に構成します。

    ![!](../../../images/waf-installation/security-edge/inline/redirect-target-host.png)
1. リダイレクト元ホスト（ユーザーがそこからリダイレクトされるホスト）を追加します。
1. **Redirect to another host**チェックボックスを有効にし、リストから対象ホストを選択します。

    ![!](../../../images/waf-installation/security-edge/inline/redirecting-host.png)

リダイレクト元ホストにoriginは不要です - HTTPSリダイレクトを返すだけで、トラフィックをプロキシしません。

## 例

以下は、ホストリダイレクトが有用な一般的なユースケースです。

### 推奨: apexドメインから`www.*`へリダイレクト

* リダイレクト元ホスト: `example.com`
* 保護対象ホスト: `www.example.com`

apexドメイン宛のトラフィックを安全に処理するため、可能な限り`www.example.com`のようなサブドメインを主要な保護対象ホストとして使用することを推奨します。

このアプローチにより、WallarmはグローバルなCNAMEを使用して複数のリージョンやクラウドプロバイダー間のトラフィックルーティングを管理でき、[複数のAレコード](deployment.md#a-records)や手動でのトラフィック分散が不要になります。

構成手順:

1. Security Edgeに[ホスト](deployment.md#4-hosts) `www.example.com`を追加し、origin、モードなど必要な設定を含めて完全に構成します。
1. ホスト`example.com`を別ホストとして追加し、`www.example.com`へのリダイレクトを有効にします。

### レガシーAPIエンドポイントのリダイレクト

* 旧ホスト: `old-api.customer.com`
* 新しい保護対象ホスト: `new-api.customer.com`

以前は`old-api.customer.com`で提供されていたAPIが`new-api.customer.com`へ移行した場合、後方互換性を確保するためにホストリダイレクトを使用してください。

構成手順:

1. Security Edgeに[ホスト](deployment.md#4-hosts) `new-api.customer.com`を追加し、origin、モードなど必要な設定を含めて完全に構成します。
1. ホスト`old-api.customer.com`を別ホストとして追加し、`new-api.customer.com`へのリダイレクトを有効にします。