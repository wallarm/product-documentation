1. Wallarm Konsolu'ndaki **Düğümler** bölümünden eski postanalytics modülünüzü seçip **Sil** butonunu tıklayarak postanalytics modülünü silin.
1. İşlemi onaylayın.
   
   Postanalytics modül düğümü Cloud'dan silindiğinde, uygulamalarınıza yapılan isteklerin filtrelenmesine katılım durur. Silme işlemi geri alınamaz. Postanalytics modül düğümü düğüm listesinden kalıcı olarak silinecektir.

1. Eski postanalytics modülüne sahip makineyi silin veya sadece Wallarm postanalytics modül bileşenlerinden temizleyin:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS ya da Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux ya da Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```