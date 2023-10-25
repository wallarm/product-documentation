[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-logic]:           logic.md
[link-markers]:         detect/markers.md
[link-ext-logic]:       logic.md

[img-generate-methods]:     ../../images/fast/dsl/en/phases/generate-methods.png
[img-generate-payload]:     ../../images/fast/dsl/en/phases/generate-payload.png

# Üretme Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, bir değişiklik uzantısında kullanılır ve işleyişi için isteğe bağlıdır (`generate` bölümü YAML dosyasında ya yoktur ya da vardır).

    Bu aşamanın, değiştirilmeyen uzantının YAML dosyasından eksik olması gerekmektedir.
    
    Uzantı türleri hakkında detaylı bilgiye [buradan][link-ext-logic] ulaşabilirsiniz.

!!! info "İstek öğesi açıklama sözdizimi"
     Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamalı ve çalışmanız gereken istek öğelerini doğru bir şekilde açıklamalısınız. 

     Detaylı bilgiye ulaşmak için bu [bağlantıya][link-points] tıklayın.
  
 Bu aşama, bir test isteği oluşturmak için bir taban isteğinin belirli parametrelerine eklenmesi gereken bir yük belirtir.

`generate` bölümünün yapısı şöyledir:

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

* `into` parametresi, yükün eklenmesi gereken tek veya çoklu istek öğelerinin belirtilmesine izin verir. Bu parametrenin değeri bir dize veya dize dizisi olabilir. `into` parametresinin değeri olarak [Ruby formatında düzenli bir ifade][link-ruby-regexp] kullanabilirsiniz.
    
    Bu parametre isteğe bağlıdır ve bölümde bulunmayabilir. Eğer `into` parametresi yoksa, yük, verilen test politikasına göre değiştirilebilir izin verilen istek öğesine eklenir.
    
    Diyelim ki aşağıdaki değiştirilebilir istek öğeleri, test politikasına göre temel istekten çıkarılmıştır:
    
    * `GET_uid_value`
    * `HEADER_COOKIE_value`
    
    Uzantı, tüm değiştirilebilir öğeleri (a.k.a. eklem noktaları) sırayla işler. 
    
    Eğer `into` parametresi yoksa, yükler sırasıyla `GET_uid_value` parametresine yapıştırılır ve oluşturulan test istekleri hedef uygulamanın zafiyetleri için kontrol edilir. Ardından, test isteği sonuçları işlendikten sonra, uzantı `HEADER_COOKIE_value` parametresini işler ve yükleri bu parametreye benzer şekilde ekler.
    
    Eğer `into` parametresi aşağıdaki örnekte olduğu gibi `GET_uid_value` istek parametresini içeriyorsa, yük `GET_uid_value` parametresine, ancak `HEADER_COOKIE_value` parametresine değil eklenir.
    
    ```
    into: 
      - 'GET_uid_value'
    ```
    Aşağıdaki örnekte sadece bir parametre bulunduğu için, into parametresi tek satırda yazılabilir:
    
    `into: 'GET_uid_value'`

* "method" — bu isteğe bağlı parametre, yükün temel istek öğesine eklenmesi için kullanılacak yöntemlerin listesini belirtir. 
    * `prefix` — yükü, temel istek öğesinin değerinden önce ekler.
    * `postfix` — yükü, temel istek öğesinin değerinden sonra ekler.
    * `random` — yükü, temel istek öğesinin değerinde rastgele bir yere ekler.
    * `replace` — temel istek öğesinin değerini yükle değiştirir.
    
    ![Yük eklemet yöntemleri][img-generate-methods]
    
    Eğer `method` parametresi yoksa, `replace` yöntemi varsayılan olarak kullanılır.
    
    Oluşturulan test isteklerinin sayısı, belirtilen `methods` sayısına bağlıdır: her ekleme yöntemi için bir test isteği.
    
    Örneğin, aşağıdaki ekleme yöntemleri belirtilmişse:
    
    ```
    method:
      - prefix
      - replace
    ```
    
    tek bir yük için iki test isteği oluşturulur; iki yük için dört test isteği oluşturulur (her bir yük için iki test isteği) ve böyle devam eder.

* `payload` parametresi, bir test isteği oluşturmak için istek parametresine eklenmesi gereken yük listesini belirtir.
    
    Bu parametre zorunludur ve bölümde daima bulunmalıdır. Liste en az bir yük içermelidir. Eğer birden çok yük varsa, FAST düğümü sırasıyla yükleri istek parametresine ekler ve oluşturulan her bir test isteği ile hedef uygulamanın zafiyetleri kontrol edilir.
    
    ![Yük oluşturma][img-generate-payload]
    
    Yük, istek işlemesi sırasında parametrelerden birine eklenen bir dizedir.
    
    ??? info "Birden çok yükün örneği"
        ```
        payload:
          - "') or 1=('1"
          - "/%5c../%5c../%5c../%5c../%5c../%5c../%5c../etc/passwd/"
        ```
    
    Zafiyet algılama olanaklarını genişletmek için yükün bir parçası olarak özel işaretçileri kullanabilirsiniz:

    * **`STR_MARKER`** —  yükte, `STR_MARKER` ın belirtildiği yerde tam olarak bir rastgele dize koyun. 
       
         Örneğin, `STR_MARKER`  uygulamanın XXS zafiyeti olup olmadığını kontrol etmek için kullanılabilir.
        
        ??? info "Örnek"
            `'userSTR_MARKER'`
    
     * **`CALC_MARKER`** — yükte, `CALC_MARKER` ın belirtildiği yerde tam olarak bir rastgele aritmetik ifade içeren bir dize koyun (örneğin, `1234*100`).
        
        Örneğin,  `CALC_MARKER`  uygulamanın RCE zafiyeti olup olmadığını kontrol etmek için kullanılabilir.
        
        ??? info "Örnek"
            `'; bc <<< CALC_MARKER'`
    
    * **`DNS_MARKER`** —  yükte, `DNS_MARKER` ın belirtildiği yerde tam olarak bir rastgele etki alanı içeren bir dize koyun (örneğin, `r4nd0m.wlrm.tl`).
        
        Örneğin, `DNS_MARKER` uygulamanın DNS Out-of-Bound zafiyetleri olup olmadığını kontrol etmek için kullanılabilir.

        ??? info "Örnek"
            `'; ping DNS_MARKER'`
    
    !!! info "Marker işlem mantığı"
        Algılama aşaması, sunucunun yanıtında herhangi bir yükten bir işaretçiyi algılarsa, saldırı başarılıdır, yani zafiyet başarıyla sömürülmüştür. Algılama aşamasının işaretçilerle çalışma hakkında ayrıntılı bilgi için şu [bağlantıya][link-markers] tıklayın.