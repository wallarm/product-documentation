# Edge NodeからオリジンへのmTLS <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

相互TLS（mTLS）は、Wallarm Edge Nodeがクライアント証明書を使用してオリジンに対して自身を認証できるようにします。これにより、オリジンは信頼できる送信元からのリクエストのみを受け入れるようになります。

[Security Edgeの構成](deployment.md)時に、Edge Node用のクライアント証明書を生成してアップロードできます。

!!! info "バージョン要件"
    mTLSは[Edge Nodeのバージョン](upgrade-and-management.md#upgrading-the-edge-inline) 5.3.14-200以降でサポートされています。

## 仕組み

オリジンでmTLSを有効にした場合：

1. フィルタリング済みトラフィックをオリジンに転送する前に、Edge NodeはTLSハンドシェイク中にクライアント証明書を提示します。
1. オリジンは、信頼できるCA（認証局）バンドルに対して証明書を検証します。
1. 証明書が有効で、期待されるパラメータ（例：Common NameまたはSubject Alternative Name）に一致する場合、接続が確立され、リクエストが受け入れられます。

![!](../../../images/waf-installation/security-edge/inline/mtls-logic.png)

## mTLSの有効化

複数の証明書をアップロードし、オリジンごとに異なる証明書を割り当てることができます。

1. 信頼できるCAにより署名されたクライアント証明書と秘密鍵のペアを生成します。次の要件を満たす必要があります。

    * **クライアント証明書**：X.509、PEM形式。

        `Extended Key Usage (EKU)`拡張に`Client Authentication`が設定されている必要があります。
    
    * **秘密鍵**：PEM形式。クライアント証明書に対応している必要があります。
    * **CAバンドル**：PEM形式。クライアント証明書の発行元認証局を含む必要があります。
1. Wallarm Console → **Security Edge** → **Configure**の**General settings**で、証明書、秘密鍵、CAバンドルをアップロードします。
1. **Origins**セクションで、対象のオリジンに対して**Require mTLS from Edge Node**を有効にし、適切な証明書を選択します。

    必要に応じて、各オリジンは異なる証明書を使用できます。
1. 設定を**Save**します。
1. オリジンを、受信接続でmTLSを必須にするように構成します。クライアント証明書の発行に使用したCAバンドルを信頼するように設定します。

![!](../../../images/waf-installation/security-edge/inline/mtls-settings-ui.png)