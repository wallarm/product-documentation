To install postanalytics separately with all-in-one installer, use:  
Tüm bileşik kurulum programıyla postanalytics'i ayrı olarak yüklemek için şunu kullanın:

=== "API token"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```        

    The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).  
    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'deki düğümlerin mantıksal gruplandırması için kullanılır).

=== "Node token"
    ```bash
    # If using the x86_64 version:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh postanalytics
    ```