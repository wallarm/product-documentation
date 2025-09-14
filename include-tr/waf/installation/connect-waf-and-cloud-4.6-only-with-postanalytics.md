Wallarm filtreleme düğümü, Wallarm Cloud ile etkileşime girer. Düğümü Cloud’a bağlamanız gerekir.

Düğümü Cloud’a bağlarken, düğümün Wallarm Console UI içinde görüntüleneceği adını belirleyebilir ve düğümü uygun **node group**’a yerleştirebilirsiniz (UI içinde düğümleri mantıksal olarak düzenlemek için kullanılır).

![Gruplandırılmış düğümler][img-grouped-nodes]

Düğümü Cloud’a bağlamak için, [uygun türde][wallarm-token-types] bir Wallarm token’ı kullanın:

=== "API token'ı"

    1. Wallarm Console → **Settings** → **API tokens** yolunu [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. `Node deployment/Deployment` kullanım türüne sahip bir API token bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
    1. Filtreleme düğümünü kurduğunuz makinede `register-node` komut dosyasını çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>`, `Deploy` rolüne sahip API token'ın kopyalanmış değeridir.
        * `--labels 'group=<GROUP>'` parametresi düğümünüzü `<GROUP>` node group’una yerleştirir (mevcutsa o grup kullanılır, mevcut değilse oluşturulur).

=== "Node token'ı"

    1. Wallarm Console → **Nodes** yolunu [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. Şunlardan birini yapın: 
        * "Wallarm node" türünde düğümü oluşturun ve üretilen token'ı kopyalayın.
        * Mevcut node group'u kullanın - node's menu → **Copy token** ile token'ı kopyalayın.
    1. Filtreleme düğümünü kurduğunuz makinede `register-node` komut dosyasını çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>`, node token'ının kopyalanmış değeridir.

* Düğüm örneğinize özel bir ad atamak için `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnek adı şu olacaktır: `HOST_NAME_NodeUUID`.