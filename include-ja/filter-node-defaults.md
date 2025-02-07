```markdown
!!! info "デフォルトの設定"
    新しくインストールされたフィルタリングノードは、デフォルトでブロッキングモードで動作します（[`wallarm_mode`](configure-parameters-en.md#wallarm_mode)ディレクティブの説明を参照）。
    
    これにより、[Wallarm Scanner](../user-guides/scanner.md)が動作しなくなる可能性があります。Scannerを使用する予定の場合は、Scannerを稼働可能な状態にするため、[追加の手順を実施する必要があります](#adding-wallarm-scanner-addresses-to-the-allowlist)。
```