# BOLA攻撃に対する自動保護 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[オブジェクトレベル認可の不備（BOLA）](../attacks-vulns-list.md#broken-object-level-authorization-bola)のような振る舞いベースの攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストでオブジェクトの識別子を用いてオブジェクトにアクセスし、認可メカニズムを回避してそのデータの読み取りや変更を行うことができます。

BOLA攻撃の潜在的な標的は可変性のあるエンドポイントです。Wallarmは、[API Discovery](overview.md)モジュールが探索したエンドポイントの中から、そのようなエンドポイントを自動的に検出して保護できます。

自動BOLA保護を有効にするには、Wallarm Console → [**BOLA protection**](../admin-en/configuration-guides/protecting-against-bola.md)に移動し、スイッチを有効に切り替えます:

![BOLAトリガー](../images/user-guides/bola-protection/trigger-enabled-state.png)

保護された各APIエンドポイントは、API inventory内で対応するアイコンで強調表示されます。例:

![BOLAトリガー](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

BOLA自動保護の状態でAPIエンドポイントをフィルタリングできます。該当するパラメータは**Others**フィルターの下にあります。