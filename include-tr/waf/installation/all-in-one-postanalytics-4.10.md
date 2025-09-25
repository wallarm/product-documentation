Hepsi-bir-arada yükleyiciyle postanalytics'i ayrı olarak kurmak için şunu kullanın:

=== "API belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplanması için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```