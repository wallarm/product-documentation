!!! info "postanalytics modülü ayrı bir sunucuda yüklüyse"
    İlk trafik işleme ve postanalytics modülleri ayrı sunucularda yüklü ise, bu modüllerin Wallarm Cloud'a aynı node token'ı kullanarak bağlanması önerilir. Wallarm Console UI, her modülü ayrı bir node örneği olarak gösterecektir, örneğin:

    ![Node with several instances][img-node-with-several-instances]

    Wallarm node, [ayrı bir postanalytics modülü kurulumu sırasında][install-postanalytics-instr] zaten oluşturulmuştur. İlk trafik işleme modülünü aynı node kimlik bilgilerini kullanarak Cloud'a bağlamak için:

    1. Ayrı postanalytics modülü kurulumu sırasında oluşturulan node token'ı kopyalayın.
    1. Aşağıdaki listede 4. adıma geçin.

Wallarm node, Wallarm Cloud ile etkileşime girer. Filtering node'u Cloud'a bağlamak için:

1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın ve **Wallarm node** tipi bir node oluşturun.

    ![Wallarm node creation][img-create-wallarm-node]
1. Oluşturulan token'ı kopyalayın.
1. Filtering node'un kurulacağı makinede `register-node` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`, kopyalanan token değeridir.

    !!! info "postanalytics modülü ayrı bir sunucuda yüklüyse"
        Postanalytics modülü ayrı bir sunucuda yüklüyse, [ayrı postanalytics modülü kurulumu sırasında][install-postanalytics-instr] oluşturulan node token'ının kullanılması önerilir.