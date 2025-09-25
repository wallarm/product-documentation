!!! info "デフォルト設定"
    新規にインストールされたフィルタリングノードは、デフォルトでブロッキングモード（[`wallarm_mode`](configure-parameters-en.md#wallarm_mode)ディレクティブの説明を参照してください）で動作します。
    
    これにより[Wallarm Scanner](../user-guides/scanner.md)が動作しない場合があります。Scannerを使用する予定がある場合は、Scannerを動作可能にするために[追加の対応が必要です](#adding-wallarm-scanner-addresses-to-the-allowlist)。