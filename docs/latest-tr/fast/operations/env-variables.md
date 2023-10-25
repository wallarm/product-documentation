[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

#   FAST Node Tarafından Kullanılan Ortam Değişkenleri Listesi

FAST node'u yapılandırmak için birçok parametre kullanılır. Bu parametrelerin değerleri, ilgili ortam değişkenleri aracılığıyla değiştirilebilir.

Ortam değişkenlerinin değerlerini ayarlayabilir ve bu değişkenleri FAST node'ya şu şekilde iletebilirsiniz:
* `-e` argümanı aracılığıyla
    
    ```
    docker run --name <container adı> \
    -e <ortam değişkeni 1>=<değer> \
    ... 
    -e <ortam değişkeni N>=<değer> \
    -p <hedef port>:8080 wallarm/fast
    ```
    
* veya bir ortam değişkenlerini içeren dosyanın yolunu belirten `--env-file` argümanı aracılığıyla

    ```
    docker run --name <container adı> \
    --env-file=<ortam değişkenleri ile dosya> \
    -p <hedef port>:8080 wallarm/fast
    ```
    
    Bu dosya, satır başına bir ortam değişkeni olacak şekilde ortam değişkenlerinin listesini içermelidir:

    ```
    # Ortam değişkenleri ile örnek dosya

    WALLARM_API_TOKEN=token_Qwe12345            # Bu örnek bir değerdir—gerçek bir token değeri kullanın
    ALLOWED_HOSTS=google-gruyere.appspot.com    # Bu domaine hedeflenen gelen istekler, bir test kaydına yazılacaktır
    ```

Yapılandırılabilir tüm parametreler aşağıdaki tabloda listelenmiştir:

| Parametre            | Değer     | Zorunlu mu? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  | Wallarm bulutundan bir token. | Evet |
| `WALLARM_API_HOST`   | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm US bulutundaki sunucu için ve <br>`api.wallarm.com` Wallarm EU bulutundaki sunucu için. | Evet |
| `ALLOWED_HOSTS`      | Bir hedef uygulamanın hostlarının listesi. Bu hostlara yöneltilen gelen istekler bir test kaydına yazılır.<br>Gelen tüm istekler varsayılan olarak kaydedilir.<br>Daha fazla detayı [burada][anchor-allowed-hosts] görebilirsiniz.| Hayır |
| `WALLARM_API_USE_SSL` | Wallarm API sunucularından birine bağlanırken SSL kullanılıp kullanılmayacağını belirler.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `true`. | Hayır |
| `WORKERS`            | Temel istekleri işleyen ve güvenlik testi yapan threadlerin sayısı.<br>Varsayılan değer: `10`. | Hayır |
| `GIT_EXTENSIONS`     | [Özel FAST DSL uzantıları][doc-dsl-ext] içeren bir Git deposuna link (bu depo FAST node containerı tarafından erişilebilir olmalıdır) | Hayır |
| `CI_MODE`            | CI/CD'ye entegre edilirken FAST node'un çalışma modu. <br>İzin verilen değerler: <br>`recording` [kayıt modu][doc-record-mode] ve <br>`testing` [test modu][doc-test-mode] için. | Hayır |
| `BACKEND_HTTPS_PORTS` | Hedef uygulama tarafından kullanılan HTTPS port numarası (veya numaraları), eğer uygulama için varsayılan olmayan port(lar) yapılandırılmışsa.<br> Bu parametrenin değerinde birkaç port listelenebilir, örneğin: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>Varsayılan değer: `443` | Hayır |
| `WALLARM_API_CA_VERIFY` | Bir Wallarm API sunucusunun CA sertifikasının doğrulanması gerekip gerekmediğini belirtir.<br>İzin verilen değerler: `true` ve `false`.<br>Varsayılan değer: `false`. | Hayır |
| `CA_CERT`            | FAST node tarafından kullanılacak bir CA sertifikasının yolunu gösterir.<br>Varsayılan değer: `/etc/nginx/ssl/nginx.crt`. | Hayır |
| `CA_KEY`             | FAST node tarafından kullanılacak bir CA özel anahtarının yolunu gösterir. <br>Varsayılan değer: `/etc/nginx/ssl/nginx.key`. | Hayır |


## Kaydedilecek İstek Sayısının Sınırlandırılması

Varsayılan olarak, FAST node tüm gelen istekleri temel istekler olarak ele alır. Bu yüzden, node bunları kaydeder ve bu isteklere dayalı olarak güvenlik testleri oluşturur ve uygular. Ancak, FAST node üzerinden hedef uygulamaya ulaşan ve temel istek olarak tanınmaması gereken gereksiz isteklerin geçmesi mümkündür.

FAST node tarafından kaydedilecek istek sayısını, hedeflenen uygulamanın dışındaki tüm istekleri filtreleyerek sınırlayabilirsiniz (bu filtrelenen istekler FAST node tarafından proxylenir ama kaydedilmez). Bu sınırlama, FAST node ve hedef uygulamaya uygulanan yükü azaltırken test sürecini hızlandırır. Bu sınırlamayı uygulamak için, istek kaynağının test sırasında hangi hostlarla etkileşimde bulunduğunu bilmelisiniz.

`ALLOWED_HOSTS` ortam değişkenini yapılandırarak tüm temel olmayan istekleri filtreleyebilirsiniz.

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

FAST node bu ortam değişkenini şu şekilde kullanır:
* Gelen isteğin `Host` başlık değeri, `ALLOWED_HOSTS` değişkeninde belirtilen değere eşleşiyorsa, FAST node isteği temel olarak kabul eder. İstek daha sonra kaydedilir ve proxilenir.
* Diğer tüm istekler FAST node üzerinden proxilenir ama kaydedilmez.

!!! info "ALLOWED_HOSTS Ortam Değişkeni Kullanım Örneği"
    Eğer değişken `ALLOWED_HOSTS=google-gruyere.appspot.com` olarak tanımlanırsa, `google-gruyere.appspot.com` domainine hedeflenen istekler temel olarak kabul edilir.