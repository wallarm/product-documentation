!!! info "デフォルト設定"
新しくインストールされたフィルタリングノードは、デフォルトでブロックモードで動作します( [`wallarm_mode`](configure-parameters-en.ja.md#wallarm_mode) ディレクティブの説明を参照)。

これにより、[Wallarm Scanner](../user-guides/scanner/intro.ja.md) が動作しなくなる可能性があります。スキャナを使用する予定がある場合は、[追加の手順](#adding---wallarm-scanner-addresses-to-the-allowlist) を実行してスキャナを動作させる必要があります。