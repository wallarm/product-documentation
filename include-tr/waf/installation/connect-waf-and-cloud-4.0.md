!!! info "Postanalytics modülü ayrı bir sunucuya kurulmuşsa"
    İlk trafik işleme ve postanalytics modülleri ayrı sunuculara kurulmuşsa, bu modüllerin Wallarm Cloud’a aynı düğüm belirteci (node token) ile bağlanması önerilir. Wallarm Console UI her modülü ayrı bir düğüm örneği (instance) olarak görüntüler, örn.:

    ![Birden fazla örneğe sahip düğüm][img-node-with-several-instances]

    [Ayrı postanalytics modülü kurulumu][install-postanalytics-instr] sırasında Wallarm düğümü zaten oluşturulmuştur. İlk trafik işleme modülünü aynı düğüm kimlik bilgileriyle Cloud’a bağlamak için:

    1. Ayrı postanalytics modülü kurulumu sırasında oluşturulan düğüm belirtecini kopyalayın.
    1. Aşağıdaki listedeki 4. adıma geçin.

Wallarm düğümü, Wallarm Cloud ile etkileşim kurar. Filtreleme düğümünü Cloud’a bağlamak için:

1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın ve **Wallarm node** türünde bir düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Filtreleme düğümünü kuracağınız makinede `register-node` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` kopyalanan belirteç değeridir.

    !!! info "Postanalytics modülü ayrı bir sunucuya kurulmuşsa"
        Postanalytics modülü ayrı bir sunucuya kurulmuşsa, [ayrı postanalytics modülü kurulumu][install-postanalytics-instr] sırasında oluşturulan düğüm belirtecini kullanmanız önerilir.