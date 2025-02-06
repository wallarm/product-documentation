1. Wallarm Console → **Nodes** bölümünde postanalytics modül düğümünüzü seçip **Delete** butonuna tıklayarak eski postanalytics modülünü silin.
1. İşlemi onaylayın.
    
    Postanalytics modül düğümü Cloud'dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesine katılımı duracaktır. Silme işlemi geri alınamaz. Postanalytics modül düğümü, düğümler listesinden kalıcı olarak silinecektir.

1. Eski postanalytics modülünün bulunduğu makineyi kaldırın veya sadece Wallarm postanalytics modül bileşenlerinden temizleyin:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```