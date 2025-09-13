# Security Edge <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edgeは、[Wallarm Node](../../about-wallarm/overview.md#filtering-node)をお客様自身でホストすることなくAPIとアプリケーションを保護できる、Wallarmのマネージドなデプロイオプションです。トラフィックを**Wallarmのグローバルに分散したEdgeインフラストラクチャ**にリダイレクトすると、そこでトラフィックがフィルタリングされ、安全にお客様のバックエンドへ転送されます。

NodeはWallarmがホスティングおよび運用しますので、お客様のチームのインフラ運用のオーバーヘッドを削減します。

## 主な利点

Security Edgeサービスは、WallarmがWallarm Nodeをデプロイ・ホスティング・管理する安全なクラウド環境を提供します:

* 運用の複雑さを最小限に抑えたフルマネージドなソリューションです。
* ターンキー展開: Wallarmがグローバルに分散した拠点にNodeを自動的にデプロイするため、必要なセットアップは最小限です。
* オートスケーリング: トラフィック負荷の変動に対応してNodeが自動的に水平スケールし、手動の設定は不要です。
* コスト削減: Wallarm管理のNodeにより運用のオーバーヘッドが低下し、より迅速な導入とスケーラビリティを実現します。
* シームレスな統合: シンプルな設定で、停止を伴うことなくAPI群を保護できます。
* PoPのグローバルネットワークとレイテンシベースのDNSステアリング: トラフィックはユーザーの近くに位置するWallarmの分散PoP（Points of Presence）を経由してルーティングされます。

## 利用可能なデプロイオプション

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>リアルタイムのトラフィックはEdge Nodeを経由するようにリダイレクトされ、フィルタリングされた後、オリジンへ転送されます</p>
        </a>

        <a class="do-card" href="../se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>非同期解析やリアルタイムブロッキングのためにEdge NodeをAPIプラットフォームに接続します</p>
        </a>
    </div>
</div>

!!! info "他のデプロイ方法"
    より高いコントロールや従来型のホスティングオプションをお探しですか？[セルフホスト型Nodeのデプロイ](../supported-deployment-options.md)と[Connectors向けセルフホスト型Nodeのデプロイ](../connectors/overview.md)をご覧ください。

## Free Tier

Security Edgeは、Free Tierプランで最大**月間500,000リクエスト - 無料**で利用できます。

Free Tierプランでは[**Quick setup** wizard](free-tier.md)からEdge Nodeをデプロイできます。  

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />