Postanalytics'i hepsi bir arada yükleyici ile ayrı olarak kurmak için şunu kullanın:

=== "API belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.16.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.16.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal olarak gruplanması için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-5.3.16.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-5.3.16.aarch64-glibc.sh postanalytics
    ```