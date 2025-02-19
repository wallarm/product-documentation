# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarmの**API Attack Surface Management**(**AASM**)は、エージェントレスの検出ソリューションで、すべての外部ホストとそのAPIを検出し、WebおよびAPIベースの攻撃に対する保護状況を評価し、不足しているWAF/WAAPソリューションを特定し、検出されたエンドポイントのセキュリティ上の問題を把握できるように設計されています。

API Attack Surface Managementには、以下が含まれます:

* [API Attack Surface Discovery (AASD)](api-surface.md)
* [Security Issues Detection](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## 動作の仕組み

API Attack Surface Managementの作業手順は以下のとおりです:

* サブスクリプションを購入します。
* スキャンするルートドメインを設定します。
* 指定したドメインに対して、Wallarmはサブドメイン／ホストを検索して一覧にします。

    AASMシステムでは、パッシブDNS解析、SSL/TLS証明書解析、Certificate Transparency Logs解析など、さまざまなOSINT手法を使用してサブドメインを収集し、検索エンジンを介して頻出するサブドメインを列挙します。

* Wallarmは各ホストの地理的位置およびデータセンターを特定します。
* Wallarmは各ホスト上で公開されているAPIを特定します。
* Wallarmはホストを保護するセキュリティソリューション(WAF/WAAP)を特定し、その効果を評価します。
* Wallarmは検出されたドメイン／ホストに対して[セキュリティ上の問題](security-issues.md)を確認します。
* 検出された場合、セキュリティ上の問題が一覧表示され、解決できるように記述されます。

## 有効化と設定

AASMを利用するには、貴社でWallarmの[API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface)サブスクリプションプランが有効になっている必要があります。アクティベートするには、以下のいずれかを実施してください:

* まだWallarmアカウントをお持ちでない場合は、価格情報を確認し、こちらのWallarm公式サイト[here](https://www.wallarm.com/product/aasm)よりAASMをアクティブにしてください。

    アクティベート時に、使用中のメールアドレスのドメインのスキャンが即時に開始され、セールスチームとの交渉を進めながら利用できます。アクティベート後、対象範囲に追加のドメインを追加できます。

* すでにWallarmアカウントをお持ちの場合は、[sales@wallarm.com](mailto:sales@wallarm.com)にお問い合わせください。

サブスクリプションがアクティブ化されると、Wallarm ConsoleのAASMの**API Attack Surface**または**Security Issues**セクション内で、ドメイン検出の設定とセキュリティ上の問題の検索を開始するために、**Configure**をクリックします。対象範囲にドメインを追加し、スキャン状況を確認してください。

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Wallarmはすべてのサブドメインを一覧表示し、該当するセキュリティ上の問題を提示します。なお、ドメインは自動的に毎日再スキャンされ、新たに見つかったサブドメインは自動的に追加され、再スキャン時に検出されなかった以前のサブドメインは一覧に残ります。

**Configure** → **Status**にて、任意のドメインのスキャンを再開、一時停止、あるいは継続できます。