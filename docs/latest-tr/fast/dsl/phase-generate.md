[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-logic]:           logic.md
[link-markers]:         detect/markers.md
[link-ext-logic]:       logic.md

[img-generate-methods]:     ../../images/fast/dsl/en/phases/generate-methods.png
[img-generate-payload]:     ../../images/fast/dsl/en/phases/generate-payload.png

#  Oluşturma Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, değişiklik yapan bir uzantıda kullanılır ve çalışması için isteğe bağlıdır (`generate` bölümü YAML dosyasında bulunmayabilir veya bulunabilir).

    Bu aşama, değişiklik yapmayan uzantının YAML dosyasında bulunmamalıdır.
    
    Uzantı türleri hakkında ayrıntılı bilgiyi [buradan][link-ext-logic] okuyun.

!!! info "İstek öğesi tanım sözdizimi"
     Bir FAST uzantısı oluştururken, noktaları kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 
     
     Ayrıntılı bilgi için şu [bağlantıya][link-points] gidin.
 
 Bu aşama, bir test isteği oluşturmak için temel isteğin belirli parametrelerine eklenecek payload’ı belirtir; bu test istekleri temel isteğe dayanır.

`generate` bölümü aşağıdaki yapıya sahiptir:

```
generate:
  - into:
    - parameter 1
    - parameter 2
    - …
    - parameter N
  - method:
    - postfix
    - prefix
    - random
    - replace
  - payload:
    - payload 1
    - payload 2
    - …
    - payload N
```

* `into` parametresi, payload’ın ekleneceği tekil veya birden fazla istek öğesini belirtmenize olanak tanır. Bu parametrenin değeri bir string veya string dizisi olabilir. `into` parametresinin değeri olarak bir [Ruby biçimli düzenli ifade][link-ruby-regexp] kullanabilirsiniz.
    
    Bu parametre isteğe bağlıdır ve bölümde yer almayabilir. `into` parametresi atlanırsa, payload verilen test ilkesine göre değiştirilebilir olan istek öğesine eklenir.
    
    Varsayalım ki test ilkesine göre temel istekten aşağıdaki değiştirilebilir istek öğeleri çıkarıldı:
    
    * `GET_uid_value`
    * `HEADER_COOKIE_value`
    
    Uzantı tüm değiştirilebilir öğeleri (ekleme noktaları olarak da bilinir) sırasıyla işler. 
    
    Eğer `into` parametresi yoksa, payload’lar sırasıyla `GET_uid_value` parametresine yapıştırılır ve oluşturulan test istekleri hedef uygulamanın güvenlik açıkları için kontrol edilmesinde kullanılır. Daha sonra test isteklerinin sonuçları işlendiğinde, uzantı `HEADER_COOKIE_value` parametresini işler ve payload’ları benzer şekilde bu parametreye ekler.
    
    Aşağıdaki örnekte gösterildiği gibi `into` parametresi `GET_uid_value` istek parametresini içeriyorsa, payload `GET_uid_value` parametresine eklenir; ancak `HEADER_COOKIE_value` parametresine eklenmez.
    
    ```
    into: 
      - 'GET_uid_value'
    ```
    Aşağıdaki örnek yalnızca bir parametre içerdiği için, into parametresinin değeri tek satırda yazılabilir:
    
    `into: 'GET_uid_value'`

* `method` — bu isteğe bağlı parametre, payload’ı temel istek öğesine eklemek için kullanılacak yöntemlerin listesini belirtir. 
    * `prefix` — payload’ı temel istek öğesi değerinin önüne ekler.
    * `postfix` — payload’ı temel istek öğesi değerinin sonuna ekler.
    * `random` — payload’ı temel istek öğesi değeri içinde rastgele bir yere ekler.
    * `replace` — temel istek öğesi değerini payload ile değiştirir.
    
    ![Payload ekleme yöntemleri][img-generate-methods]
    
    `method` parametresi yoksa varsayılan olarak `replace` yöntemi kullanılır.
    
    Oluşturulan test isteklerinin sayısı, belirtilen `method` sayısına bağlıdır: ekleme yöntemi başına bir test isteği.
    
    Örneğin, aşağıdaki ekleme yöntemleri belirtilmişse:
    
    ```
    method:
      - prefix
      - replace
    ```
    
    o zaman tek bir payload için iki test isteği oluşturulur; iki payload için dört test isteği oluşturulur (her payload için iki test isteği) vb.

* `payload` parametresi, hedef uygulamayı güvenlik açıkları için test edecek test isteğini oluşturmak amacıyla istek parametresine eklenecek payload listesini belirtir.
    
    Bu parametre zorunludur ve bölümde her zaman bulunmalıdır. Liste en az bir payload içermelidir. Birden fazla payload varsa, FAST düğümü payload’ları sırayla istek parametresine ekler ve oluşturulan her bir test isteğini kullanarak hedef uygulamayı güvenlik açıkları açısından test eder.
    
    ![Payload oluşturma][img-generate-payload]
    
    Payload, istek işleme sırasında parametrelerden birine eklenen bir string’dir.
    
    ??? info "Birden çok payload örneği"
        ```
        payload:
          - "') or 1=('1"
          - "/%5c../%5c../%5c../%5c../%5c../%5c../%5c../etc/passwd/"
        ```
    
    Güvenlik açığı tespit olanaklarını daha da genişletmek için payload’ın bir parçası olarak özel işaretçiler kullanabilirsiniz:

    * **`STR_MARKER`** — payload içinde `STR_MARKER`’ın belirtildiği konuma tam olarak rastgele bir string ekler. 
        
        Örneğin, `STR_MARKER` bir XXS güvenlik açığını kontrol etmek için kullanılabilir.
        
        ??? info "Örnek"
            `'userSTR_MARKER'`
    
    * **`CALC_MARKER`** — payload içinde `CALC_MARKER`’ın belirtildiği konuma tam olarak rastgele bir aritmetik ifade içeren (örneğin, `1234*100`) bir string ekler.
        
        Örneğin, `CALC_MARKER` bir RCE güvenlik açığını kontrol etmek için kullanılabilir.
        
        ??? info "Örnek"
            `'; bc <<< CALC_MARKER'`
    
    * **`DNS_MARKER`** — payload içinde `DNS_MARKER`’ın belirtildiği konuma tam olarak rastgele bir alan adı (örneğin, `r4nd0m.wlrm.tl`) içeren bir string ekler.
        
        Örneğin, `DNS_MARKER` DNS Out-of-Bound güvenlik açıklarını kontrol etmek için kullanılabilir.

        ??? info "Örnek"
            `'; ping DNS_MARKER'`
    
    !!! info "İşaretçilerin çalışma mantığı"
        Detect aşaması, sunucunun yanıtında herhangi bir payload’daki işaretçiyi tespit ederse saldırı başarılı sayılır, yani güvenlik açığı başarıyla istismar edilmiştir. İşaretçilerle çalışan Detect aşaması hakkında ayrıntılı bilgi için şu [bağlantıya][link-markers] gidin.