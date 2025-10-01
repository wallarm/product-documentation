Wallarm düğümü, Wallarm Cloud ile etkileşim kurar. Filtreleme düğümünü Cloud'a bağlamak için:

1. [postanalytics modülü ayrı kurulmuşsa][install-postanalytics-instr]:

    1. Ayrı postanalytics modülü kurulumu sırasında oluşturulan düğüm jetonunu kopyalayın.
    1. Aşağıdaki listenin 5. adımına geçin. İlk trafiği işleyen düğüm ile postanalizi gerçekleştiren düğüm için tek bir jeton kullanmanız önerilir.
1. Wallarm Console → **Nodes** bölümünü [ABD Cloud](https://us1.my.wallarm.com/nodes) veya [AB Cloud](https://my.wallarm.com/nodes) üzerinde açın ve **Wallarm node** türünde düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]
1. Oluşturulan jetonu kopyalayın.
1. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:
    
    === "ABD Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "AB Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    * `<NODE_TOKEN>`, kopyalanan jeton değeridir.
    * Düğüm örneğiniz için özel bir ad belirlemek üzere `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnek adı şu olacaktır: `HOST_NAME_NodeUUID`.

!!! info "Birden çok kurulum için tek jeton kullanma"
    Seçilen dağıtım seçeneğinden bağımsız olarak tek bir jeton kullanarak birden fazla Wallarm düğümünü Cloud'a bağlayabilirsiniz. Bu seçenek, Wallarm Console arayüzünde düğüm örneklerinin mantıksal olarak gruplandırılmasına olanak tanır:

    ![Birden çok örneğe sahip düğüm][img-node-with-several-instances]
    
    Aşağıda, birden çok kurulum için tek bir jeton kullanmayı tercih edebileceğiniz bazı örnekler verilmiştir:

    * Bir geliştirme ortamına birkaç Wallarm düğümü dağıtıyorsunuz; her düğüm, belirli bir geliştiriciye ait kendi makinesinde bulunuyor
    * İlk trafik işleme düğümleri ile postanalytics modülleri ayrı sunuculara kuruludur - bu modüllerin Wallarm Cloud'a aynı düğüm jetonunu kullanarak bağlanması önerilir