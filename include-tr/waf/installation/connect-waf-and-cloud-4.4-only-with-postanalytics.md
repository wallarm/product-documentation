Filtreleme düğümü Wallarm Bulutu ile etkileşim kurar. Düğümü Bulut'a bağlamak için:

1. Wallarm Konsolu'nu açın → [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde **Düğümler** ve **Wallarm düğümü** türünde bir düğüm oluşturun.

    ![Wallarm düğüm oluşturma][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Filtreleme düğümünü kurdugunuz makinede `register-node` komut dosyasını çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` kopyalanan belirteç değeridir.

    !!! bilgi "Bir belirteci birden fazla yükleme için kullanma"
        Seçilen [platforma][deployment-platform-docs] bakılmaksızın bir belirteci birden fazla yüklemelerde kullanabilirsiniz. Bu, Wallarm Konsolu kullanıcı arayüzünde düğüm örneklerinin mantıksal gruplandırılmasını sağlar. Örnek: bir geliştirme ortamına birden fazla Wallarm düğümü yerleştirirsiniz, her düğüm belirli bir geliştiriciye ait kendi makinesindedir.