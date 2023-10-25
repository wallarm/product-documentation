Wallarm düğümü, Wallarm Bulutu ile etkileşim kurar. Filtreleme düğümünü Buluta bağlamak için:

1. Ayrı ayrı [postanalytics modülü yüklü][install-postanalytics-instr] ise:

    1. Ayrı postanalytics modül yüklemesi sırasında oluşturulan düğüm belirtecini kopyalayın.
    1. Aşağıdaki listeyle 5. adıma geçin. İlk trafiği işleyen düğüm ve sonrasında analiz yapan düğüm için bir belirteç kullanmanız **tavsiye edilir**.
1. Wallarm Konsolunu açın → [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes) 'ndaki **Düğümler** seçeneğine gidin ve **Wallarm düğümü** tipinde bir düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Filtreleme düğümünü yüklediğiniz makinede `register-node` komut dosyasını çalıştırın:

    === "ABD Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "AB Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>` kopyalanan belirteç değeridir.
    * Düğüm örneğiniz için özel bir isim belirlemek için `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnekleme ismi şöyle olacak: `HOST_NAME_NodeUUID`.

!!! info "Birkaç kurulum için tek belirteç kullanma"
    Seçilen dağıtım seçeneğinden bağımsız olarak, bir belirteci kullanarak birkaç Wallarm düğümünü Buluta bağlayabilirsiniz. Bu seçenek, Wallarm Konsolu kullanıcı arayüzünde düğüm örneklerinin mantıksal gruplanmasına izin verir:

    ![Birkaç örnekleme sahip düğüm][img-node-with-several-instances]
    
    Aşağıda, birkaç kurulum için tek bir belirteç kullanmayı seçebileceğiniz bazı örnekler bulunmaktadır:

    * Birkaç Wallarm düğümünü bir geliştirme ortamına yerleştirirsiniz, her düğüm belirli bir geliştiriciye ait kendi makinesindedir
    * Başlangıç trafiği işleme düğümleri ve postanalytics modülleri ayrı sunuculara yüklenir - bu modülleri Wallarm Buluta aynı düğüm belirteci kullanarak bağlamak **tavsiye edilir**
