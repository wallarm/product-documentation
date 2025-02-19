[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

#   FAST Düğümü Tarafından Kullanılan Ortam Değişkenlerinin Listesi

FAST düğümünü yapılandırmak için birçok parametre kullanılmaktadır. Bu parametrelerin değerleri, karşılık gelen ortam değişkenleri aracılığıyla değiştirilebilir.

Ortam değişkenlerinin değerlerini ayarlayabilir ve bu değişkenleri FAST düğümüne aşağıdaki yollarla aktarabilirsiniz:
* `-e` argümanı ile
    
    ```
    docker run --name <container name> \
    -e <environment variable 1>=<value> \
    ... 
    -e <environment variable N>=<value> \
    -p <target port>:8080 wallarm/fast
    ```
    
* veya ortam değişkenlerini içeren dosyanın yolunu belirten `--env-file` argümanı ile

    ```
    docker run --name <container name> \
    --env-file=<file with environment variables> \
    -p <target port>:8080 wallarm/fast
    ```
    
    Bu dosya, her satırda bir değişken olacak şekilde ortam değişkenleri listesini içermelidir:

    ```
    # Ortam değişkenleri örnek dosyası

    WALLARM_API_TOKEN=token_Qwe12345            # Bu örnek bir değerdir—gerçek bir token değeri kullanın
    ALLOWED_HOSTS=google-gruyere.appspot.com    # Bu alana gönderen istekler, test kaydı olarak yazılacaktır
    ```

Tüm yapılandırılabilir parametreler aşağıdaki tabloda listelenmiştir:

| Parameter             | Value     | Required? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm cloud'dan alınan bir token. | Yes |
| `WALLARM_API_HOST`   	| Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm US cloud'daki sunucu için ve <br>`api.wallarm.com` Wallarm EU cloud'daki sunucu için. | Yes |
| `ALLOWED_HOSTS`       | Hedef uygulamanın hostlarının listesi. Bu hostlara gönderilen istekler test kaydı olarak yazılacaktır.<br>Tüm gelen istekler varsayılan olarak kaydedilir.<br>Daha fazla ayrıntı için bkz. [buradan][anchor-allowed-hosts].| No |
| `WALLARM_API_USE_SSL` | Wallarm API sunucularından biriyle bağlantı kurulurken SSL kullanımını tanımlar.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `true`. | No |
| `WORKERS`             | Temel istekleri işleyen ve güvenlik testleri yapan iş parçacıklarının sayısı.<br>Varsayılan değer: `10`. | No |
| `GIT_EXTENSIONS`      | FAST DSL uzantılarını içeren [custom FAST DSL extensions][doc-dsl-ext] barındıran Git deposuna bağlantı (bu deponun FAST düğüm konteyneri tarafından erişilebilir olması gerekmektedir) | No |
| `CI_MODE`             | CI/CD entegrasyonu sırasında FAST düğümünün çalışma modu. <br>İzin verilen değerler: <br>[recording mode][doc-record-mode] için `recording` ve <br>[testing mode][doc-test-mode] için `testing`. | No |
| `BACKEND_HTTPS_PORTS` | Hedef uygulama için varsayılan olmayan portlar yapılandırılmışsa, uygulama tarafından kullanılan HTTPS port numarası veya numaraları.<br>Bu parametrenin değerinde birkaç port listelenebilir, örneğin: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>Varsayılan değer: `443` | No |
| `WALLARM_API_CA_VERIFY` | Bir Wallarm API sunucusunun CA sertifikasının doğrulanıp doğrulanmayacağını belirler.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `false`. | No |
| `CA_CERT`             | FAST düğümü tarafından kullanılacak CA sertifikasının yolu.<br>Varsayılan değer: `/etc/nginx/ssl/nginx.crt`. | No |
| `CA_KEY`              | FAST düğümü tarafından kullanılacak CA özel anahtarının yolu. <br>Varsayılan değer: `/etc/nginx/ssl/nginx.key`. | No |


## Kaydedilecek İstek Sayısının Sınırlandırılması

Varsayılan olarak, FAST düğümü tüm gelen istekleri temel istek olarak değerlendirir. Bu nedenle, düğüm bu istekleri kaydeder ve bunlara dayalı olarak güvenlik testleri oluşturup çalıştırır. Ancak, temel istek olarak algılanmaması gereken gereksiz isteklerin, hedef uygulamaya iletilebilmesi mümkündür.

FAST düğümünün kaydedeceği istek sayısını, uygulamaya yönelik olmayan tüm istekleri filtreleyerek sınırlayabilirsiniz (unutmayın, FAST düğümü filtrelenen istekleri proxyler ancak kaydetmez). Bu sınırlama, FAST düğümüne ve hedef uygulamaya uygulanan yükü azaltırken, test sürecini hızlandırır. Bu sınırlamayı uygulayabilmek için, test sırasında istek kaynağının hangi hostlarla etkileşimde bulunduğunu bilmeniz gerekmektedir.

Temel istek dışındaki tüm istekleri, `ALLOWED_HOSTS` ortam değişkenini yapılandırarak filtreleyebilirsiniz.

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

FAST düğümü bu ortam değişkenini aşağıdaki şekilde kullanır:
* Gelen isteğin `Host` başlığı değeri, `ALLOWED_HOSTS` değişkeninde belirtilen değere eşitse, FAST düğümü isteği temel istek olarak kabul eder. İstek hem kaydedilir hem de proxylenir.
* Diğer tüm istekler FAST düğümü aracılığıyla proxylenir ancak kaydedilmez.

!!! info "ALLOWED_HOSTS Ortam Değişkeni Kullanım Örneği"
    Değişken `ALLOWED_HOSTS=google-gruyere.appspot.com` olarak tanımlanmışsa, `google-gruyere.appspot.com` domainine gönderilen istekler temel istek olarak kabul edilir.
