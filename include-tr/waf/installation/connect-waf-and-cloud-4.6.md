Wallarm filtreleme düğümü, Wallarm Cloud ile etkileşime geçer. Düğümü Cloud'a bağlamanız gerekir.

Düğümü Cloud'a bağlarken, Wallarm Console UI'da görüntüleneceği düğüm adını belirleyebilir ve düğümü uygun **düğüm grubuna** (UI'da düğümleri mantıksal olarak düzenlemek için kullanılır) koyabilirsiniz.

![Gruplandırılmış düğümler][img-grouped-nodes]

Düğümü Cloud'a bağlamak için, [uygun türde][wallarm-token-types] bir Wallarm token'ı kullanın:

=== "API belirteci"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. `Node deployment/Deployment` kullanım türüne sahip API token'ını bulun veya oluşturun.
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
        
        * `<TOKEN>`, `Deploy` rolüne sahip API token'ının kopyalanmış değeridir.
        * `--labels 'group=<GROUP>'` parametresi, düğümünüzü `<GROUP>` düğüm grubuna yerleştirir (mevcut ise kullanılır, değilse oluşturulur). Filtreleme ve postanalytics modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, bunları aynı gruba koymanız önerilir.

=== "Düğüm belirteci"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. Şunlardan birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan token'ı kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğümün menüsünden → **Copy token** ile token'ı kopyalayın.
    1. Filtreleme düğümünü kurduğunuz makinede `register-node` betiğini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`, düğüm token'ının kopyalanmış değeridir. Filtreleme ve postanalytics modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, aynı düğüm token'ını kullanarak bunları aynı gruba koymanız önerilir.

* Düğüm örneğiniz için özel bir ad ayarlamak üzere `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnek adı şu şekilde olacaktır: `HOST_NAME_NodeUUID`.