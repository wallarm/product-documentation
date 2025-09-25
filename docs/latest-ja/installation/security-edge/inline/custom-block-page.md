# Security Edge Inlineのブロックページ <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge Inline Nodeが悪意のあるリクエストをブロックした場合、HTTP 403 Forbiddenレスポンスとともにスタイル付きのブロックページを返すことができます。

!!! info "バージョン要件"
    スタイル付きのブロックページの返却はEdge Nodeバージョン5.3.16-2以降でサポートされています。

## ブロックページの外観

スタイル付きのブロックページは、リクエストがブロックされたことをユーザーにわかりやすく通知します:

![Wallarmのブロックページ](../../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## カスタムブロックページの有効化

バージョン5.3.16-2以降では、カスタムブロックページがデフォルトで有効です。

この機能を制御するには、Wallarm Console → Security Edge → Inline → Configure → Return styled page for blocked requestsに移動します。