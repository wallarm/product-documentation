[access-wallarm-api-docs]: overview.md#your-own-api-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm API istek örnekleri

Aşağıda Wallarm API kullanımına dair bazı örnekler yer almaktadır. Ayrıca [US bulutu](https://apiconsole.us1.wallarm.com/) veya [EU bulutu](https://apiconsole.eu1.wallarm.com/) için API Reference UI üzerinden kod örnekleri üretebilirsiniz. Deneyimli kullanıcılar, tarayıcının Geliştirici konsolunu (“Network” sekmesi) kullanarak, Wallarm hesabınızın UI'ı tarafından genel API'den veri almak için hangi API uç noktalarının ve isteklerin kullanıldığını hızlıca öğrenebilir. Geliştirici konsolunu nasıl açacağınıza dair bilgiyi resmi tarayıcı dokümantasyonunda bulabilirsiniz ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## Son 24 saat içinde tespit edilen ilk 50 saldırıyı alın

Lütfen `TIMESTAMP` değerini, 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürerek değiştirin.

--8<-- "../include/api-request-examples/get-attacks-en.md"

## Çok sayıda saldırı alın (100 ve üzeri)

100 veya daha fazla kaydı içeren saldırı ve hit kümeleri için, performansı optimize etmek amacıyla büyük veri kümelerini bir kerede almak yerine verileri daha küçük parçalar halinde almak en iyisidir. İlgili Wallarm API uç noktaları, sayfa başına 100 kayıt ile imleç (cursor) tabanlı sayfalamayı destekler.

Bu teknik, veri kümesindeki belirli bir öğeye işaretçi döndürmeyi ve ardından sonraki isteklerde sunucunun verilen işaretçiden sonraki sonuçları döndürmesini içerir. İmleç sayfalamasını etkinleştirmek için istek parametrelerine `"paging": true` dahil edin.

Aşağıda, imleç sayfalaması kullanılarak `<TIMESTAMP>` tarihinden bu yana tespit edilen tüm saldırıları almak için API çağrısı örnekleri yer almaktadır:

=== "AB Bulutu"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Bulutu"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Bu istek, en yenisinden en eskiye doğru sıralanmış şekilde tespit edilen son 100 saldırı hakkındaki bilgileri döndürür. Ayrıca yanıtta, bir sonraki 100 saldırı kümesine işaret eden bir `cursor` parametresi de bulunur.

Sonraki 100 saldırıyı almak için, önceki isteğin aynısını kullanın ancak önceki isteğin yanıtından kopyalanan işaretçi değeri ile `cursor` parametresini ekleyin. Bu, API'nin bir sonraki 100 saldırı kümesini nereden döndürmeye başlayacağını bilmesini sağlar, örneğin:

=== "AB Bulutu"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Bulutu"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

Daha sonraki sayfaları almak için, değeri önceki yanıttan kopyalanmış `cursor` parametresini içeren istekler yürütün.

Aşağıda, imleç sayfalaması kullanarak saldırıları almak için Python kodu örneği verilmiştir:

=== "AB Bulutu"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX zamanı

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
=== "US Bulutu"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX zamanı

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

## Son 24 saat içinde doğrulanan ilk 50 olayı alın

İstek, saldırı listesi için önceki örneğe çok benzer; bu isteğe `"!vulnid": null` terimi eklenmiştir. Bu terim, API'ye belirli bir güvenlik açığı kimliği belirtilmemiş tüm saldırıları yok saymasını söyler ve sistem saldırılar ile olayları bu şekilde ayırt eder.

Lütfen `TIMESTAMP` değerini, 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürerek değiştirin.

--8<-- "../include/api-request-examples/get-incidents-en.md"

## Son 24 saat içinde durumu "active" olan ilk 50 güvenlik açığını alın

Lütfen `TIMESTAMP` değerini, 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürerek değiştirin.

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## Yapılandırılmış tüm kuralları alın

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## Tüm kuralların yalnızca koşullarını alın

--8<-- "../include/api-request-examples/get-conditions.md"

## Belirli bir koşula bağlı kuralları alın

Belirli bir koşulu belirtmek için ID’sini kullanın - bunu tüm kuralların koşullarını isterken alabilirsiniz (yukarıya bakın).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## `/my/api/*` adresine gönderilen tüm istekleri engellemek için sanal yama oluşturun

--8<-- "../include/api-request-examples/create-rule-en.md"

## Belirli bir uygulama örneği ID'si için `/my/api/*` adresine gönderilen tüm istekleri engellemek üzere sanal yama oluşturun

Bu isteği göndermeden önce bir uygulama [yapılandırılmalıdır](../user-guides/settings/applications.md). `action.point[instance].value` alanında mevcut bir uygulamanın ID’sini belirtin.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## `X-FORWARDED-FOR` başlığının belirli değeri olan istekleri saldırı olarak değerlendirecek kural oluşturun

Aşağıdaki istek, `^(~(44[.]33[.]22[.]11))$` regexp’ine dayalı [özel saldırı göstergesi](../user-guides/rules/regex-rule.md) oluşturacaktır.

`MY.DOMAIN.COM` alan adına gelen isteklerde `X-FORWARDED-FOR: 44.33.22.11` HTTP başlığı varsa, Wallarm düğümü bunları tarayıcı saldırıları olarak değerlendirecek ve ilgili [filtration mode](../admin-en/configure-wallarm-mode.md) ayarlanmışsa saldırıları engelleyecektir.

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## Belirli uygulama için filtration mode değerini monitoring olarak ayarlayan kural oluşturun

Aşağıdaki istek, ID’si `3` olan [uygulama](../user-guides/settings/applications.md) için, trafiği filtreleyecek [düğümü ayarlayan kuralı](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) monitoring modunda oluşturacaktır.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## Kuralı ID'sine göre silin

[Yapılandırılmış tüm kuralları alırken](#get-all-configured-rules) silinecek kuralın ID’sini kopyalayabilirsiniz. Ayrıca, kural oluşturma isteğine verilen yanıtta `id` yanıt parametresi içinde kural ID’si döndürülmüştür.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## IP listesi nesnelerini alma, doldurma ve silme için API çağrıları

Aşağıda, [IP listesi](../user-guides/ip-lists/overview.md) nesnelerini alma, doldurma ve silmeye yönelik bazı API çağrısı örnekleri yer almaktadır.

### API istek parametreleri

IP listelerini okumak ve değiştirmek için API isteklerinde iletilecek parametreler:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Listeye `.csv` dosyasındaki girdileri ekleyin

`.csv` dosyasından IP’leri veya alt ağları listeye eklemek için aşağıdaki bash betiğini kullanın:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Listeye tek bir IP veya alt ağ ekleyin

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Listeye birden fazla ülke ekleyin

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Listeye birden fazla proxy hizmeti ekleyin

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IP listesinden bir nesneyi silin

Nesneler, IP listelerinden ID’leri ile silinir.

Bir nesnenin ID’sini almak için IP listesi içeriğini isteyin ve yanıttan ilgili nesnenin `objects.id` değerini kopyalayın:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Nesne ID’sine sahip olduğunuzda, onu listeden silmek için aşağıdaki isteği gönderin:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Silme isteğinde ID’leri bir dizi olarak geçerek birden fazla nesneyi aynı anda silebilirsiniz.