Hepsi bir arada yükleyici ile postanalytics'i ayrı olarak kurmak için şunu kullanın:

=== "API belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği group'u ayarlar (Wallarm Console UI'de düğümlerin mantıksal gruplandırılması için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```