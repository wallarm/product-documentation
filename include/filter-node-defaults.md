!!! info "Default Settings"
    A freshly installed filter node operates in blocking mode (see the [`wallarm_mode`](configure-parameters-en.md#wallarm_mode) directive description) by default.
    
    This may result in the inoperable [Wallarm scanner](../user-guides/scanner/intro.md). If you plan to use the scanner, then you [need to perform additional actions](#adding-wallarm-scanner-addresses-to-the-whitelist) to render scanner operational.