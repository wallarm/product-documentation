# Kendi Müşteriniz
../user-guides/settings/applications.md
https://apiconsole.us1.wallarm.com/
https://apiconsole.eu1.wallarm.com/
https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac
https://developers.google.com/web/tools/chrome-devtools/
https://developer.mozilla.org/en-US/docs/Tools
https://help.vivaldi.com/article/developer-tools/
https://www.unixtimestamp.com/
https://www.unixtimestamp.com/
https://www.unixtimestamp.com/
../user-guides/settings/applications.md
../user-guides/rules/regex-rule.md
../admin-en/configure-wallarm-mode.md
../user-guides/rules/wallarm-mode-rule.md
../user-guides/settings/applications.md
#tüm-yapılandırılmış-kuralları-al
../user-guides/ip-lists/overview.md

[access-wallarm-api-docs]: #kendi-müşteriniz
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm API istek örnekleri

İşte Wallarm API kullanımına dair bazı örnekler. Ayrıca, kod örneklerini [US cloud](https://apiconsole.us1.wallarm.com/) veya [EU cloud](https://apiconsole.eu1.wallarm.com/) için API Reference UI üzerinden de oluşturabilirsiniz. Deneyimli kullanıcılar, tarayıcının Geliştirici konsolunu ("Ağ" sekmesi) kullanarak, Wallarm hesabınızın kullanıcı arayüzünün halka açık API'den hangi verileri almak için hangi API uç noktalarını ve istekleri kullandığını hızlıca öğrenebilir. Geliştirici konsolunu açma hakkında bilgi bulmak için, resmi tarayıcı belgelerini kullanabilirsiniz ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## Son 24 saatte algılanan ilk 50 saldırıyı alın

Lütfen `TIMESTAMP` yerine 24 saat önceki tarihini [Unix Timestamp](https://www.unixtimestamp.com/) biçimine dönüştürülmüş halini girin. 

--8<-- "../include-tr/api-request-examples/get-attacks-en.md"

## Büyük sayıda saldırıyı alın (100 ve üzeri)

100 veya daha fazla kayıt içeren saldırı ve hit setleri için, performansı optimize etmek amacıyla tüm büyük veri kümelerini bir seferde almak yerine daha küçük parçalar halinde almak en iyisidir. İlgili Wallarm API uç noktaları, sayfa başına 100 kayıtla imleç tabanlı sayfalama destekler.

Bu teknik, veri kümesindeki belirli bir öğeye bir işaretçi döndürmeyi ve ardından sonraki isteklerde, sunucunun belirli işaretçiden sonraki sonuçları döndürmesini içerir. İmleç paginasyonunu etkinleştirmek için, istek parametrelerinde `"paging": true` içerir.

Aşağıdakiler, imleç paginasyonunu kullanarak `<TIMESTAMP>` tarihinden bu yana algılanan tüm saldırıları almak için API çağrılarının örnekleridir:

=== "EU Bulutu"
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

Bu istek, en son algılanan 100 saldırı hakkında bilgi döndürür, en yeniden en eskiye sıralanmış. Ayrıca, yanıt, bir sonraki 100 saldırı setine bir işaretçi içeren bir `cursor` parametresi içerir.

Bir sonraki 100 saldırıyı almak için, bir önceki yanıtın sonucundan kopyalanan işaretçi değeriyle `cursor` parametresini içerecek şekilde aynı isteği kullanın. Bu, API'nin bir sonraki 100 saldırı setini nereden döndürmeye başlayacağını bilmesini sağlar, örneğin:

=== "EU Bulutu"
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

Daha fazla sonuç sayfasını almak için, önceki yanıttan kopyalanan değerle `cursor` parametresini içeren istekler gönderin.

Aşağıda, imleç paginasyonunu kullanarak saldırıları almak için Python kodu örneği bulunmaktadır:

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

## Son 24 saatte onaylanan ilk 50 olayı alın

Bu istek, saldırılar listesi için önceki örneğe çok benzer; bu isteğe `"!vulnid": null` terim eklenmiştir. Bu terim, API'nın belirli bir açıklık kimliği olmadan tüm saldırıları göz ardı etmesini sağlar ve bu, sistem attacks ve olaylar arasında ayrım yapar.

Lütfen `TIMESTAMP` yerine 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş halini girin.

--8<-- "../include-tr/api-request-examples/get-incidents-en.md"

## Son 24 saat içinde "aktif" durumundaki ilk 50 açığı alın

Lütfen `TIMESTAMP` yerine 24 saat önceki tarihi [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş halini girin.

--8<-- "../include-tr/api-request-examples/get-vulnerabilities.md"

## Tüm yapılandırılmış kuralları alın

--8<-- "../include-tr/api-request-examples/get-all-configured-rules.md"

## Tüm kuralların koşullarını alın

--8<-- "../include-tr/api-request-examples/get-conditions.md"

## Belirli bir koşula eklenmiş kuralları alın

Belirli bir koşulu göstermek için, tüm kuralların koşullarını istediğinizde alabileceğiniz kimliğini kullanın.

--8<-- "../include-tr/api-request-examples/get-rules-by-condition-id.md"

## Tüm istekleri `/my/api/*`'a göndermek üzere engelleyen sanal yamayı oluşturun

--8<-- "../include-tr/api-request-examples/create-rule-en.md"

## Belirli bir uygulama örneği kimliği için tüm istekleri `/my/api/*`'a göndermek üzere engelleyen sanal yamayı oluşturun 

Bu isteği göndermeden önce bir uygulamanın [yapılandırılması](../user-guides/settings/applications.md) gerekir. `action.point[instance].value` içinde mevcut bir uygulamanın kimliğini belirtin.

--8<-- "../include-tr/api-request-examples/create-rule-for-app-id.md"

## `X-FORWARDED-FOR` başlığının belirli bir değeri olan isteklerin saldırılar olarak kabul edilmesi için bir kural oluşturun

Aşağıdaki istek, `^(~(44[.]33[.]22[.]11))$` dayalı [regex'ni özel saldırı göstergesi yapar](../user-guides/rules/regex-rule.md).

Eğer `MY.DOMAIN.COM` alan adına giden isteklerde `X-FORWARDED-FOR: 44.33.22.11` HTTP başlığı varsa, Wallarm düğümü bunları tarayıcı saldırıları olarak kabul eder ve ilgili [filtrasyon modu](../admin-en/configure-wallarm-mode.md) ayarlanmışsa saldırıları engeller.

--8<-- "../include-tr/api-request-examples/create-rule-scanner.md"

## Belirli bir uygulama için filtrasyon modunu izlemeye ayarlama kuralını oluşturun

Aşağıdaki istek, trafiği filtrelemek için [düğümü ayarlayan kuralı](../user-guides/rules/wallarm-mode-rule.md) oluşturacak ve ID `3` olan [uygulama](../user-guides/settings/applications.md) için izleme modunda koruma sağlar.

--8<-- "../include-tr/api-request-examples/create-filtration-mode-rule-for-app.md"

## Kuralı bu kimliğiyle silin

Silinecek olan kuralın kimliğini, [tüm yapılandırılmış kuralları alırken](#tüm-yapılandırılmış-kuralları-al) kopyalayabilirsiniz. Ayrıca, kural oluşturma isteğine yanıt olarak bir kural kimliği de `id` yanıt parametresinde döndürülmüştür.

--8<-- "../include-tr/api-request-examples/delete-rule-by-id.md"

## IP listesi nesnelerini almak, doldurmak ve silmek için API çağrıları

Aşağıda, IP listesi nesnelerini almak, doldurmak ve silmek için API çağrılarının bazı örnekleri bulabilirsiniz.

### API istek parametreleri

IP listelerini okumak ve değiştirmek için API isteklerine geçirilen parametreler:

--8<-- "../include-tr/api-request-examples/ip-list-request-params.md"

### Listeye `.csv` dosyasından girdileri ekleyin

Listeye IP'leri veya alt ağları `.csv` dosyasından eklemek için, aşağıdaki bash betiğini kullanın:

--8<-- "../include-tr/api-request-examples/add-ips-to-lists-from-file.md"

### Listeye tek bir IP veya alt ağ ekleyin

--8<-- "../include-tr/api-request-examples/add-some-ips-to-lists.md"

### Listeye birden fazla ülke ekleyin

--8<-- "../include-tr/api-request-examples/add-some-countries-to-lists.md"

### Listeye birden fazla proxy hizmeti ekleyin

--8<-- "../include-tr/api-request-examples/add-some-proxies-to-lists.md"

### IP listesinden bir nesneyi silin

Nesneleri, kimliklerine göre IP listelerinden sileriz.

Nesne kimliğini almak için, IP listesi içeriğini isteyin ve gereken nesnenin `objects.id`sini yanıtından kopyalayın:

--8<-- "../include-tr/api-request-examples/get-ip-list-contents.md"

Nesne kimliğine sahip olduğunuzda, onu listeden silmek için aşağıdaki isteği gönderin:

--8<-- "../include-tr/api-request-examples/delete-object-from-ip-list.md"

Kimliklerini silme isteğinde bir dizi olarak geçirerek birden fazla nesneyi aynı anda silebilirsiniz.