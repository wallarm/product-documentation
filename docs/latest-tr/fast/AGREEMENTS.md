# Metin Biçimlendirme Kuralları

Rehberler boyunca size belirli sayıda metin dizesi ve girilmesi veya çalıştırılması gereken komutlar sunulacaktır. Gerekli olduğunda bazı dize ve komut anahtar sözcüklerinin farklı biçimlendirmeleri ile karşılaşacaksınız. Aşağıdaki kurallar tüm rehberler boyunca geçerlidir:

| Biçimlendirme Kuralı             | Açıklama |
| -----------------------------  | ------------------------------------------------------------ |
|`düz yazı` | Düz yazı yazılmış yazı tipi diziler, bilgilendirme amaçlıdır ve okuyucu tarafından girilmesi beklenmez.<br>Bu tür dizeler bir komut çıktısını veya başka bir bilgi parçasını temsil edebilir. |
|Örnek: | Bir Bash kabuğunun daveti:<br>`$`                     |
|**`kalın`**  | Kalın tip yazılmış dizeler, okuyucu tarafından “olduğu gibi” girilmelidir. |
|Örnek: | Linux'ta sistem bilgisini görüntülemek için aşağıdaki komutu girin:<br>`$` **`uname -a`** |
|*`italik`* veya  *`<italik>`* | İtalik yazı tipi yazılmış dizeler, okuyucunun sağlaması gereken değerleri temsil eder. Örneğin, bir komut argümanı *`<isim>`* olarak biçimlendirilmişse, bu isim olarak bazı değerler sağlamalısınız, *`<isim>*` yerine.<br>Tek bir kelimeyle tanımlanamayan bir giriş varsa, dizi <...> parantezi içine yerleştirilir. Bir değer girerken parantezleri çıkarmanız gerekir. Örneğin, bir komut argümanı *`<kullanıcı şifresi>`* olarak biçimlendirilmişse, < ve > sembollerini çıkararak şifreyi girmelisiniz. |
|Örnek: | `cat` komutu, Linux’ta bir dosyanın içeriğini görüntülemek için aşağıdaki şekilde kullanılabilir:<br>`$` **`cat`** *`dosyaadı`*<br>`$` **`cat`** *`<dosya adı>`*<br><br> Eğer MyFile.txt adlı bir dosyanın içeriğini görüntülemeniz gerekiyorsa, aşağıdaki komutu çalıştırın:<br>`cat MyFile.txt` |