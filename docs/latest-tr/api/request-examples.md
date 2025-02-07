[access-wallarm-api-docs]: overview.md#your-own-api-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm API İstek Örnekleri

Aşağıda Wallarm API'nin kullanımına dair bazı örnekler verilmiştir. Ayrıca [US cloud](https://apiconsole.us1.wallarm.com/) veya [EU cloud](https://apiconsole.eu1.wallarm.com/) için API Reference UI aracılığıyla kod örnekleri oluşturabilirsiniz. Deneyimli kullanıcılar, Wallarm hesabınızın genel API'den veri almak için UI tarafından kullanılan API uç noktalarını ve isteklerini hızlıca öğrenmek amacıyla tarayıcılarının Developer console ("Network" sekmesi) özelliğini de kullanabilir. Developer console'un nasıl açılacağı hakkında bilgi almak için resmi tarayıcı dokümantasyonuna bakabilirsiniz ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## Son 24 Saatte Tespit Edilen İlk 50 Saldırıyı Alın

Lütfen `TIMESTAMP` değerini, 24 saat öncesine ait tarihin [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş hali ile değiştirin.

--8<-- "../include/api-request-examples/get-attacks-en.md"

## Çok Sayıda Saldırıyı Alın (100 ve Üzeri)

100 veya daha fazla kayda sahip saldırı ve hit setleri için, büyük veri kümelerini tek seferde çekmek yerine, performansı optimize etmek amacıyla bunları parçalar halinde almak en iyisidir. İlgili Wallarm API uç noktaları, sayfa başına 100 kayıt olacak şekilde imleç tabanlı sayfalamayı destekler.

Bu teknik, veri kümesindeki belirli bir öğeye işaret eden bir gösterge döndürmeyi ve sonraki isteklerde sunucunun verilen gösterge sonrası sonuçları döndürmesini içerir. İmleçli sayfalamayı etkinleştirmek için istek parametrelerine `"paging": true` ekleyin.

Aşağıda, imleçli sayfalama kullanılarak `<TIMESTAMP>`'den itibaren tespit edilen tüm saldırıların alınması için API çağrısı örnekleri verilmiştir:

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Bu istek, en yeni 100 saldırı hakkında bilgiyi, en güncelden en eskisine doğru sıralı şekilde döndürür. Ek olarak, yanıt içerisinde bir sonraki 100 saldırı setine işaret eden `cursor` parametresi de yer alır.

Bir sonraki 100 saldırıyı almak için, önceki istek ile aynı isteği kullanın fakat önceki yanıttan kopyalanan işaretçi değeriyle birlikte `cursor` parametresini ekleyin. Bu, API'nın bir sonraki 100 saldırı setinin nereden başlaması gerektiğini anlamasını sağlar, örneğin:

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Sonraki sonuç sayfalarını almak için, önceki yanıttan kopyalanan değere sahip `cursor` parametresini içeren istekleri gönderin.

Aşağıda, imleçli sayfalama kullanarak saldırıları almak için Python kod örneği verilmiştir:

=== "EU Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```
=== "US Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://us1.api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "X-WallarmAPI-Secret": "<YOUR_SECRET_KEY>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```

## Son 24 Saatte Onaylanan İlk 50 İnsidenti Alın

Bu istek, saldırı listesindeki önceki örneğe çok benzer; bu isteğe `"!vulnid": null` terimi eklenmiştir. Bu terim, API'ya belirtilmemiş vulnerability ID'sine sahip tüm saldırıları göz ardı etmesini söyler ve sistemin saldırılar ile incident'lar arasında ayrım yapmasını sağlar.

Lütfen `TIMESTAMP` değerini, 24 saat öncesine ait tarihin [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş hali ile değiştirin.

--8<-- "../include/api-request-examples/get-incidents-en.md"

## Son 24 Saat İçinde "active" Durumundaki İlk 50 Güvenlik Açığını Alın

Lütfen `TIMESTAMP` değerini, 24 saat öncesine ait tarihin [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş hali ile değiştirin.

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## Tüm Yapılandırılmış Kuralları Alın

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## Tüm Kuralların Sadece Şartlarını Alın

--8<-- "../include/api-request-examples/get-conditions.md"

## Belirli Bir Şarta Bağlı Kuralları Alın

Belirli bir şartı işaret etmek için, onun ID'sini kullanın - tüm kuralların şartlarını sorguladığınızda (yukarıya bakın) bunu edinebilirsiniz.

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## `/my/api/*`'ye Gönderilen Tüm İstekleri Engellemek İçin Sanal Yama Oluşturun

--8<-- "../include/api-request-examples/create-rule-en.md"

## `/my/api/*`'ye Gönderilen Tüm İstekleri Engellemek İçin Belirli Bir Uygulama Örneği ID'sine Sahip Sanal Yama Oluşturun

Bu isteği göndermeden önce bir uygulama [yapılandırılmış](../user-guides/settings/applications.md) olmalıdır. `action.point[instance].value` alanına mevcut bir uygulamanın ID'sini belirtin.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## `X-FORWARDED-FOR` Başlığının Belirli Bir Değerine Sahip İstekleri Saldırı Olarak Değerlendirmek İçin Kural Oluşturun

Aşağıdaki istek, [regexp tabanlı özel saldırı göstergesini](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$` oluşturacaktır.

Eğer `MY.DOMAIN.COM` alan adına yapılan istekler `X-FORWARDED-FOR: 44.33.22.11` HTTP başlığına sahip ise, Wallarm node'u bunları tarayıcı saldırısı olarak değerlendirir ve ilgili [filtration mode](../admin-en/configure-wallarm-mode.md) ayarlanmışsa saldırıları engeller.

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## Belirli Uygulama İçin Monitoring Modunda Filtrasyon Modunu Ayarlayan Kuralı Oluşturun

Aşağıdaki istek, monitoring modunda olan, [uygulamaya](../user-guides/settings/applications.md) giden trafiği filtrelemesi için düğümü ayarlayan [kuralı](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) oluşturacaktır. İlgili uygulamanın ID'si `3` olarak belirtilmiştir.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## Kuralı ID'sine Göre Silin

Silinmek üzere kuralın ID'sini, [tüm yapılandırılmış kuralları alırken](#get-all-configured-rules) kopyalayabilirsiniz. Ayrıca, kural oluşturma isteğine verilen yanıtta `id` response parametresi aracılığıyla da kural ID'si döndürülür.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## IP Listesi Nesnelerini Almak, Doldurmak ve Silmek İçin API Çağrıları

Aşağıda, [IP listesi](../user-guides/ip-lists/overview.md) nesnelerini almak, doldurmak ve silmek için bazı API çağrısı örnekleri verilmiştir.

### API İstek Parametreleri

IP listelerini okumak ve değiştirmek için API isteklerine geçirilecek parametreler:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv` Dosyasındaki Girdileri Listeye Ekleyin

`.csv` dosyasındaki IP'ler veya alt ağları listeye eklemek için aşağıdaki bash betiğini kullanın:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Listeye Tek Bir IP veya Alt Ağ Ekleyin

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Listeye Birden Fazla Ülke Ekleyin

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Listeye Birden Fazla Proxy Servis Ekleyin

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IP Listesinden Bir Nesneyi Silin

Nesneler, IP listelerden ID'leriyle silinir.

Bir nesnenin ID'sini elde etmek için, IP liste içeriğini sorgulayın ve istenen nesnenin `objects.id` değerini yanıt içerisinden kopyalayın:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Nesne ID'sine sahip olduktan sonra, liste içerisinden silmek için aşağıdaki isteği gönderin:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Silme isteğinde ID'lerini bir dizi olarak geçirerek aynı anda birden fazla nesneyi silebilirsiniz.