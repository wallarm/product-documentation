!!! bilgi "Eğer postanalytics modülü ayrı bir sunucuya kurulmuşsa"
    İlk trafik işleme ve postanalytics modülleri aynı sunucuya kurulmuşsa, bu modülleri aynı düğüm belirtecini kullanarak Wallarm Bulutu'na bağlamak önerilir. Wallarm Konsol UI, her modülü ayrı bir düğüm örneği olarak gösterecektir, örneğin:

    ![Çoklu örneği bulunan bir düğüm][img-node-with-several-instances]

    Wallarm düğümü zaten [ayrı postanalytics modülü kurulumu][install-postanalytics-instr] sırasında oluşturulmuştur. Aynı düğüm kimlik bilgilerini kullanarak ilk trafik işlemesi modülünü Bulut'a bağlamak için:

    1. Ayrı postanalytics modülü kurulumu sırasında oluşturulan düğüm belirtecini kopyalayın.
    1. Aşağıdaki listenin 4. adımına geçin.

Wallarm düğümü, Wallarm Bulutu ile etkileşimdedir. Filtreleme düğümünü Bulut'a bağlamak için:

1. Wallarm Konsolu'nu açın → [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) 'taki **Nodes** ve **Wallarm düğümü** tipinde bir düğüm oluşturun.

    ![Wallarm düğümü oluşturma][img-create-wallarm-node]
1. Oluşturulan belirteci kopyalayın.
1. Filtreleme düğümünü kurduğunuz bir makinede `register-node` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <DÜĞÜM_BELİRTEÇ> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <DÜĞÜM_BELİRTEÇ>
        ```
    
    `<DÜĞÜM_BELİRTEÇ>` kopyalanan belirteç değeridir.

    !!! bilgi "Eğer postanalytics modülü ayrı bir sunucuya kurulmuşsa"
        Eğer postanalytics modülü ayrı bir sunucuya kurulmuşsa, [ayrı postanalytics modülü kurulumu][install-postanalytics-instr] sırasında oluşturulan düğüm belirtecini kullanmanız önerilir.