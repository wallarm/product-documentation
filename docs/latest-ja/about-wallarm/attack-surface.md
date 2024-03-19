# API アタックサーフェス管理

Wallarmの**API アタックサーフェス管理**（**AASM**）は、組織が自身のAPIによって提示される公開攻撃サーフェスを列挙、評価、管理することを可能にする一連の機能です。AASMを使用することで、アプリケーション提供および統合のためのAPIの成長に伴って生じるこれまで未知のリスクを把握することができます。これには、APIリークが含まれます。

![API アタックサーフェス管理](../images/about-wallarm-waf/api-attack-surface/api-attack-surface.png)

WallarmのAPI アタックサーフェス管理ソリューションには以下が含まれます：

* [公開アセットの発見](../user-guides/scanner.md) - すべての公開利用可能なアセットとAPIを特定します。
* [API リーク検出](../about-wallarm/api-leaks.md) - 公開ソースをスキャンして、漏洩したトークンと認証情報を検出します。
* [API 脆弱性評価](../about-wallarm/detecting-vulnerabilities.md) - 脆弱性とセキュリティ問題を検出します。
* [API リスク管理](../user-guides/vulnerabilities.md) - 特定されたすべてのAPIリスクを制御および軽減します。