# Security Edge Inlineの概要 <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

[**Security Edge**](../overview.md)プラットフォームは、Wallarmがホストする環境内の地理的に分散したロケーションにWallarm Nodesをデプロイするためのマネージドサービスを提供します。主要なデプロイオプションの1つがインラインデプロイで、お客様側でのインストールを必要とせず、API全体に対してリアルタイムかつ堅牢な保護を提供します。

![!](../../../images/waf-installation/security-edge/inline/traffic-flow.png)

## ユースケース

これは、次のような場合にAPIを保護する理想的なソリューションです。

* 運用の複雑さを最小限に抑えたフルマネージドなセキュリティソリューションを求めている場合です。
* DNS経由でトラフィックをWallarmにルーティングできる場合です。

## 仕組み

Security Edge Inlineでは、APIトラフィックはWallarmのグローバルに分散したPoints of Presence（PoPs）を経由してルーティングされます。これらのPoPにはWallarm Nodesがデプロイされ、Wallarmによってホストおよび管理されます。

* DNSベースのトラフィックリダイレクト：APIドメインの解決先をWallarm Edge Nodeに向けるようDNSを構成します。
* PoPの選択とルーティング：レイテンシーまたは選択したリージョンに基づいて、リクエストは最寄りの利用可能なPoPにルーティングされます。
* リアルタイム検査とフィルタリング：inline Nodeが受信リクエストを解析し、正当なトラフィックをオリジンサーバーに転送する前に悪意のあるものをブロックします。
* マルチクラウドおよびマルチリージョン：高可用性とジオ冗長性のために、複数のクラウドリージョンにわたりinline Nodesをデプロイできます。
* 自動スケーリングとアップデート：WallarmがNodeのスケーリング、アップデート、メンテナンスを処理します。お客様側での作業は不要です。

## 制限事項

* 64文字未満のドメインのみがサポート対象です。
* HTTPSトラフィックのみがサポート対象で、HTTPは許可されません。
* [カスタムブロッキングコード](../../../admin-en/configuration-guides/configure-block-page-and-code.md)の設定はまだサポートされていません。

## デプロイ

Security Edge Inlineをデプロイするには、[段階的な手順](deployment.md)に従ってください。