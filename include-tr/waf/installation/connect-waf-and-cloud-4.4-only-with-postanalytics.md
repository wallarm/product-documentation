The filtering node, Wallarm Cloud ile etkileşim halindedir. Node'u Cloud'a bağlamak için:

1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden açın ve **Wallarm node** türünde bir node oluşturun.

    ![Wallarm node creation][img-create-wallarm-node]
1. Oluşturulan token’ı kopyalayın.
1. Filtering node’unu kurduğunuz makinede `register-node` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`, kopyalanan token değeridir.

    !!! info "Birden Fazla Kurulumda Aynı Token'ın Kullanılması"
        Seçtiğiniz [platforma][deployment-platform-docs] bakılmaksızın bir token'ı birden fazla kuruluma kullanabilirsiniz. Bu, Wallarm Console arayüzünde node örneklerini mantıksal olarak gruplandırmanıza olanak tanır. Örnek: Geliştirme ortamına birden fazla Wallarm node dağıtırsınız, her node belirli bir geliştiriciye ait ayrı bir makinede yer alır.