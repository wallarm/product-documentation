[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

#   Bir FAST node tarafından kullanılan ortam değişkenlerinin listesi

FAST node'u yapılandırmak için birçok parametre kullanılır. Bu parametrelerin değerleri ilgili ortam değişkenleri aracılığıyla değiştirilebilir.

Ortam değişkenlerinin değerlerini ayarlayabilir ve bu değişkenleri FAST node'a aşağıdaki yollardan biriyle iletebilirsiniz:
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
    
    Bu dosya, her satırda bir değişken olacak şekilde ortam değişkenlerinin listesini içermelidir:

    ```
    # Ortam değişkenleri içeren örnek dosya

    WALLARM_API_TOKEN=token_Qwe12345            # Bu örnek bir değerdir—yerine gerçek bir token değeri kullanın
    ALLOWED_HOSTS=google-gruyere.appspot.com    # Bu etki alanını hedefleyen gelen istekler bir test kaydına yazılacaktır
    ```

Yapılandırılabilir tüm parametreler aşağıdaki tabloda listelenmiştir:

| Parametre             | Değer     | Zorunlu mu? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm Cloud'dan bir token. | Evet |
| `WALLARM_API_HOST`   	| Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>Wallarm US cloud içindeki sunucu için `us1.api.wallarm.com` ve <br>Wallarm EU cloud içindeki sunucu için `api.wallarm.com`. | Evet |
| `ALLOWED_HOSTS`       | Hedef uygulamanın host listesidir. Bu hostları hedefleyen gelen istekler bir test kaydına yazılacaktır.<br>Varsayılan olarak tüm gelen istekler kaydedilir.<br>Daha fazla ayrıntı için [buraya][anchor-allowed-hosts] bakın.| Hayır |
| `WALLARM_API_USE_SSL` | Wallarm API sunucularından birine bağlanırken SSL kullanılıp kullanılmayacağını belirler.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `true`. | Hayır |
| `WORKERS`             | Temel (baseline) istekleri işleyen ve güvenlik testlerini yapan iş parçacıklarının sayısı.<br>Varsayılan değer: `10`. | Hayır |
| `GIT_EXTENSIONS`      | [özel FAST DSL uzantıları][doc-dsl-ext] içeren Git deposunun bağlantısı (bu depoya FAST node konteyneri tarafından erişilebilir olmalıdır) | Hayır |
| `CI_MODE`             | CI/CD'ye entegrasyon sırasında FAST node'un çalışma modu. <br>İzin verilen değerler: <br>[kayıt modu][doc-record-mode] için `recording` ve <br>[test modu][doc-test-mode] için `testing`. | Hayır |
| `BACKEND_HTTPS_PORTS` | Hedef uygulama için varsayılan dışı port(lar) yapılandırıldıysa, uygulama tarafından kullanılan HTTPS port numarası/numaraları.<br>Bu parametre değerinde birkaç port listelenebilir, örneğin: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>Varsayılan değer: `443` | Hayır |
| `WALLARM_API_CA_VERIFY` | Wallarm API sunucusunun CA sertifikasının doğrulanıp doğrulanmayacağını belirler.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `false`. | Hayır |
| `CA_CERT`             | FAST node tarafından kullanılacak CA sertifikasının yolu.<br>Varsayılan değer: `/etc/nginx/ssl/nginx.crt`. | Hayır |
| `CA_KEY`              | FAST node tarafından kullanılacak CA özel anahtarının yolu. <br>Varsayılan değer: `/etc/nginx/ssl/nginx.key`. | Hayır |


<a id="limiting-the-number-of-requests-to-be-recorded"></a>
## Kaydedilecek isteklerin sayısını sınırlama

Varsayılan olarak FAST node, tüm gelen istekleri temel (baseline) istekler olarak kabul eder. Bu nedenle, bu istekleri kaydeder ve bunlara dayanarak güvenlik testleri oluşturup yürütür. Ancak FAST node üzerinden hedef uygulamaya, temel istek olarak tanımlanmaması gereken gereksiz istekler de geçebilir.

FAST node tarafından kaydedilecek isteklerin sayısını, uygulamayı hedeflemeyen tüm istekleri filtreleyerek sınırlayabilirsiniz (FAST node filtrelenen istekleri proxy'ler ancak kaydetmez). Bu sınırlama, FAST node ve hedef uygulama üzerindeki yükü azaltırken test sürecini hızlandırır. Bu sınırlamayı uygulamak için, test sırasında istek kaynağının hangi hostlarla etkileşime girdiğini bilmeniz gerekir.

Tüm temel olmayan istekleri `ALLOWED_HOSTS` ortam değişkenini yapılandırarak filtreleyebilirsiniz.

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

FAST node bu ortam değişkenini aşağıdaki şekilde kullanır:
* Gelen isteğin `Host` başlığının değeri `ALLOWED_HOSTS` değişkeninde belirtilen değerle eşleşiyorsa, FAST node isteği temel (baseline) bir istek olarak kabul eder. İstek kaydedilir ve proxy'lenir.
* Tüm diğer istekler FAST node üzerinden proxy'lenir ancak kaydedilmez.

!!! info "ALLOWED_HOSTS ortam değişkeni kullanım örneği"
    Değişken `ALLOWED_HOSTS=google-gruyere.appspot.com` olarak tanımlanırsa, `google-gruyere.appspot.com` etki alanını hedefleyen istekler temel (baseline) istek olarak kabul edilir.