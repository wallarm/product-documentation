Wallarm filtreleme düğümü, Wallarm Bulutu ile etkileşim kurar. Düğümü Buluta bağlamanız gerekmektedir.

Düğümü Buluta bağlarken, Wallarm Konsol UI'da görüntülenecek düğüm adını belirleyebilir ve düğümü uygun bir **düğüm grubuna** yerleştirebilirsiniz (UI'da düğümleri mantıksal olarak organize etmek için kullanılır).

![Gruplandırılmış düğümler][img-grouped-nodes]

Düğümü Buluta bağlamak için, uygun türde bir Wallarm belirtecini kullanın: [wallarm-token-types]:

=== "API belirteci"

    1. Wallarm Konsolu'nu açın → **Ayarlar** → [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) 'da **API belirteçleri**.
    1. `Deploy` kaynak rolü olan bir API belirteci bulun veya oluşturun.
    1. Bu belirteci kopyalayın.
    1. Filtreleme düğümünü kuran bir makinede `register-node` komut dizinini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```

        * `<TOKEN>` `Deploy` rolündeki API belirtecinin kopyalanan değeridir.
        * `--labels 'group=<GROUP>'` parametresi, düğümünüzü `<GROUP>` düğüm grubuna yerleştirir (mevcut veya yoksa oluşturulur). Filtreleme ve post-analiz modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, bunların aynı gruba konulması önerilir.

=== "Düğüm belirteci"

    1. Wallarm Konsolu'nu açın → [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)'da **Düğümler**.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm düğümü** türünde bir düğüm oluşturun ve oluşturulan belirteci kopyalayın.
        * Var olan bir düğüm grubunu kullanın - düğüm menüsünün → **Belirteci kopyala** seçeneği kullanarak belirteci kopyalayın.
    1. Filtreleme düğümünü kurduğunuz bir makinede `register-node` komut dizinini çalıştırın:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` düğüm belirtecini(nin) kopyalanan değeridir. Filtreleme ve post-analiz modüllerini [ayrı ayrı][install-postanalytics-instr] kuruyorsanız, bunların aynı gruba aynı düğüm belirteci kullanarak konulması önerilir.

* Düğüm örneğinize özel bir ad belirlemek için `-n <HOST_NAME>` parametresini ekleyebilirsiniz. Son örnek adı: `HOST_NAME_NodeUUID` olacaktır.