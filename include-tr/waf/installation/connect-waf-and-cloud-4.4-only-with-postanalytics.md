Filtreleme düğümü, Wallarm Cloud ile etkileşir. Düğümü Wallarm Cloud'a bağlamak için:

1. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde Wallarm Console → **Nodes** bölümünü açın ve **Wallarm node** türünde düğüm oluşturun.

    ![Wallarm node oluşturma][img-create-wallarm-node]
1. Oluşturulan token'ı kopyalayın.
1. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>`, kopyaladığınız token değeridir.

    !!! info "Birden çok kurulum için tek bir token kullanma"
        Seçilen [platform][deployment-platform-docs] ne olursa olsun, birden çok kurulumda tek bir token kullanabilirsiniz. Bu, Wallarm Console UI içinde düğüm örneklerinin mantıksal olarak gruplanmasını sağlar. Örnek: bir geliştirme ortamına birden fazla Wallarm node dağıtırsınız, her node, belirli bir geliştiriciye ait kendi makinesindedir.