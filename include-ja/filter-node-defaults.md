!!! info "デフォルト設定"
新たにインストールされたフィルタリングノードは、デフォルトでブロッキングモード（[`wallarm_mode`](configure-parameters-en.md#wallarm_mode)のディレクティブの説明を参照）で動作します。

これにより、[Wallarm Scanner](../user-guides/scanner.md)が作動しない可能性があります。Scannerを使用する予定がある場合は、Scannerが作動するように[追加のアクションを実行する](#adding-wallarm-scanner-addresses-to-the-allowlist)必要があります。