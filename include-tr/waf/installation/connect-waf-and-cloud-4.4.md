The Wallarm node, Wallarm Cloud ile etkileşime girer. Filtreleme düğümünü Cloud'a bağlamak için:

1. Eğer [postanalytics module ayrı olarak kurulmuşsa][install-postanalytics-instr]:

    1. Ayrı postanalytics module kurulumu sırasında oluşturulan düğüm token'ını kopyalayın.
    1. Aşağıdaki listedeki 5. adıma geçin. İlk trafik işleme ve postanaliz gerçekleştiren düğüm için aynı token'ın kullanılması **tavsiye edilir**.
1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın ve **Wallarm node** tipi düğümü oluşturun.

    ![Wallarm node creation][img-create-wallarm-node]
1. Oluşturulan token'ı kopyalayın.
1. Filtreleme düğümünü kurduğunuz makinede `register-node` script'ini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>` kopyalanan token değeridir.
    * Düğüm örneğiniz için özel bir isim belirlemek adına `-n <HOST_NAME>` parametresi ekleyebilirsiniz. Oluşacak nihai örnek ismi: `HOST_NAME_NodeUUID`.

!!! info "Birden fazla kurulum için tek token kullanımı"
    Seçilen dağıtım seçeneğine bakılmaksızın, tek bir token kullanarak birden fazla Wallarm node'u Cloud'a bağlayabilirsiniz. Bu seçenek, Wallarm Console kullanıcı arayüzünde düğüm örneklerinin mantıksal olarak gruplandırılmasını sağlar:

    ![Node with several instances][img-node-with-several-instances]
    
    Aşağıda, birden fazla kurulum için tek token kullanmayı tercih edebileceğiniz bazı örnekler verilmiştir:

    * Geliştirme ortamına birden fazla Wallarm node'u kuruyorsunuz, her düğüm belirli bir geliştiriciye ait kendi makinesinde.
    * İlk trafik işleme ve postanalytics module için düğümler ayrı sunucularda kuruluysa - bu modülleri Wallarm Cloud'a aynı düğüm token'ını kullanarak bağlamak **tavsiye edilir**.