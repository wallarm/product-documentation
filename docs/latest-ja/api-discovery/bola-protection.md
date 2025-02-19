# BOLA攻撃に対する自動防御 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola)などの振る舞い攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストを介してオブジェクト識別子によってオブジェクトにアクセスし、認証メカニズムを回避してそのデータを読み取ったり変更したりすることが可能です。

BOLA攻撃の潜在的な対象は、可変性のあるエンドポイントです。Wallarmは、[API Discovery](overview.md)モジュールで探索されたエンドポイントの中から、そのようなエンドポイントを自動的に検出し保護します。

自動BOLA保護を有効にするには、Wallarm Console → [**BOLA protection**](../admin-en/configuration-guides/protecting-against-bola.md)に進み、スイッチを有効状態に切り替えます:

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

保護された各APIエンドポイントは、APIインベントリ内で対応するアイコンで強調表示されます。例:

![BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

APIエンドポイントをBOLA自動保護状態でフィルタリングできます。該当するパラメータは**Others**フィルタ内に存在します。