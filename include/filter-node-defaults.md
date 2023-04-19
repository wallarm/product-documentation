!!! info "Default settings"
    A freshly installed filtering node operates in blocking mode (see the [`wallarm_mode`](configure-parameters-en.md#wallarm_mode) directive description) by default.
    
    This may result in the inoperable [Wallarm Scanner](../user-guides/scanner.md). If you plan to use the Scanner, then you [need to perform additional actions](#adding-wallarm-scanner-addresses-to-the-allowlist) to render Scanner operational.