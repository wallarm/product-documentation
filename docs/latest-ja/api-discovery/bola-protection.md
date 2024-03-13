# BOLA攻撃に対する自動防御 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) などの行動的攻撃は、同名の脆弱性を利用します。この脆弱性により、攻撃者はAPIリクエストを通じてオブジェクトにその識別子でアクセスし、承認メカニズムを回避してそのデータを読み取ったり変更したりできます。

BOLA攻撃の潜在的なターゲットは、変動性を持つエンドポイントです。Wallarmは、[API Discovery](overview.md) モジュールによって探索されたものの中から、そのようなエンドポイントを自動的に発見し保護することができます。

自動BOLA保護を有効にするには、Wallarmコンソールに進み → [**BOLA保護**](../admin-en/configuration-guides/protecting-against-bola.md) に移動し、スイッチを有効な状態に切り替えてください：

![BOLAトリガー](../images/user-guides/bola-protection/trigger-enabled-state.png)

保護された各APIエンドポイントは、APIインベントリ内で対応するアイコンで強調表示されます。例えば：

![BOLAトリガー](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

APIエンドポイントをBOLA自動保護状態でフィルタリングできます。該当するパラメータは、**その他**フィルターの下で利用可能です。