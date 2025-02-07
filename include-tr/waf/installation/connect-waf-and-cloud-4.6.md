The Wallarm filtreleme düğümü, Wallarm Cloud ile etkileşim kurar. Düğümü Cloud'a bağlamanız gerekir.

Düğümü Cloud'a bağlarken, düğüm adını ayarlayabilir, bu isim Wallarm Console UI'de görüntülenecek ve düğümü uygun **node group** içine yerleştirebilirsiniz (UI'de düğümlerin mantıksal olarak organize edilmesi için kullanılır).

![Grouped nodes][img-grouped-nodes]

Düğümü Cloud'a bağlamak için, [uygun tipteki][wallarm-token-types] bir Wallarm token'ı kullanın:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** sayfasını açın ([US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)).
    1. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
    1. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>`, `Deploy` rolüne sahip API token'ın kopyalanmış değeridir.
        * `--labels 'group=<GROUP>'` parametresi, düğümünüzü `<GROUP>` node group'una ekler (var olan; yoksa oluşturulur). Filtreleme ve postanalytics modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, bunları aynı gruba koymanız tavsiye edilir.

=== "Node token"

    1. Wallarm Console → **Nodes** sayfasını açın ([US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)).
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan token'ı kopyalayın.
        * Mevcut node group'u kullanın - düğümün menüsünden → **Copy token** ile token'ı kopyalayın.
    1. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`, kopyaladığınız node token'ının değeridir. Filtreleme ve postanalytics modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, aynı node token'ını kullanarak bunları aynı gruba koymanız tavsiye edilir.

* Düğüm örneğiniz için özel bir ad belirlemek amacıyla `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Nihai örnek adı: `HOST_NAME_NodeUUID`.