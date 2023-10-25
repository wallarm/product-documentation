# Proxy Olmadan Tekil İstekleri Doğrulama

Belirli bir OpenAPI spesifikasyonuna dayalı tekil API isteklerini doğrulamanız ve daha fazla proxy'ye ihtiyaç duymamanız gerekiyorsa, non-proxy modunda Wallarm API Firewall'ı kullanabilirsiniz. Bu durumda, çözüm yanıtları doğrulamaz.

!!! bilgi "Özellik kullanılabilirliği"
    Bu özellik, API Firewall versiyonları 0.6.12 ve sonraki sürümler için kullanılabilir ve REST API için özelleştirilmiştir.

Bunu yapmak için:

1. Konteynıra OpenAPI spesifikasyon dosyasını [mount etmek](../installation-guides/docker-container.md) yerine, bir veya daha fazla OpenAPI 3.0 spesifikasyonu içeren [SQLite veritabanını](https://www.sqlite.org/index.html) `/var/lib/wallarm-api/1/wallarm_api.db` adresine mount edin. Veritabanı, aşağıdaki şemaya uygun olmalıdır:

    * `schema_id`, integer (oto-artırım) - Spesifikasyonun ID'si.
    * `schema_version`, string - Spesifikasyon sürümü. Tercih ettiğiniz herhangi bir sürümü atayabilirsiniz. Bu alan değiştiğinde, API Firewall spesifikasyonun kendisinin değiştiğini varsayar ve onu buna göre günceller.
    * `schema_format`, string - Spesifikasyon formatı, `json` veya `yaml` olabilir.
    * `schema_content`, string - Spesifikasyon içeriği.
1. Konteynırı, `APIFW_MODE=API` ortam değişkeni ile ve gerektiğinde, bu mod için özel olarak tasarlanmış diğer değişkenlerle çalıştırın:

    | Ortam değişkeni | Açıklama |
    | -------------------- | ----------- |
    | `APIFW_MODE` | Genel API Firewall modunu ayarlar. Olası değerler [`PROXY`](docker-container.md) (varsayılan), [`graphql`](graphql/docker-container.md) ve `API`.|
    | `APIFW_SPECIFICATION_UPDATE_PERIOD` | Spesifikasyon güncellemelerinin sıklığını belirler. `0` olarak ayarlanırsa, spesifikasyon güncellemesi devre dışı bırakılır. Varsayılan değer `1m` (1 dakika). |
    | `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` | İstek parametrelerinin, spesifikasyonda tanımlanmış olanlarla eşleşmediği durumda bir hata kodu döndürüp döndürmeyeceğini belirtir. Varsayılan değer `true`. |
    | `APIFW_PASS_OPTIONS` | `true` olarak ayarlandığında, API Firewall, `OPTIONS` metodu tarif edilmemiş olsa bile, spesifikasyondaki uç noktalara `OPTIONS` isteklerine izin verir. Varsayılan değer `false`. |

1. İsteklerin monte edilen spesifikasyonlarla hizalı olup olmadığını değerlendirirken, hangi spesifikasyonun doğrulama için kullanılacağını API Firewall'a belirtmek için `X-Wallarm-Schema-ID: <schema_id>` başlığını ekleyin.

API Firewall istekleri şu şekilde doğrular:

* Bir istek spesifikasyonla eşleşirse, 200 durum koduyla boş bir yanıt döndürülür.
* Bir istek spesifikasyonla eşleşmezse, yanıt 403 durum kodu sağlar ve uyumsuzluğun nedenlerini açıklayan bir JSON belgesi sunar.
* Bir isteği işlemeyi veya doğrulamayı başaramazsa, 500 durum koduyla boş bir yanıt döndürülür.