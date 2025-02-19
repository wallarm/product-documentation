#   Metin biçimlendirme kuralları

Rehberler boyunca, girilmesi veya çalıştırılması gereken belirli metin dizeleri ve komutlar sunulacaktır. Gerekirse, bazı dizelerin ve komut anahtar kelimelerinin çeşitli biçimlendirmeleri sağlanacaktır. Aşağıdaki kurallar, rehberler genelinde geçerlidir:

| Biçimlendirme kuralı                 | Açıklama |
| -----------------------------  | ------------------------------------------------------------    |
|`regular` | Düzenli monospaced yazı tipiyle yazılmış dizeler bilgilendiricidir ve okuyucu tarafından girilmesi beklenmez.<br>Böyle dizeler bir komut çıktısını veya başka bir bilgi parçasını temsil edebilir.|
|Example: | Bir Bash kabuğunun daveti:<br>`$`                     |
|**`boldface`**  | Kalın monospaced yazı tipiyle yazılmış dizeler, okuyucu tarafından aynen girilmelidir. |
|Example: | Linux'ta sistem bilgilerini görüntülemek için aşağıdaki komutu girin:<br>`$` **`uname -a`** |
|*`italics`* veya  *`<italics>`* | İtalik, monospaced yazı tipiyle yazılmış dizeler, okuyucu tarafından sağlanması gereken değerleri temsil eder. Örneğin, eğer bir komut argümanı *`<name>`* olarak biçimlendirilmişse, o isimle bir değer sağlamalısınız, *`<name>`* değil.<br>Eğer bir girdi tek kelimeyle ifade edilemiyorsa, dize <...> şeklinde parantez içine alınır. Bir değeri girerken parantezleri kaldırmalısınız. Örneğin, bir komut argümanı *`<user password>`* olarak biçimlendirilmişse, parolayı < ve > sembolleri olmadan girmelisiniz. |
|Example: | Linux'ta bir dosyanın içeriğini görüntülemek için `cat` komutu aşağıdaki şekilde kullanılabilir:<br>`$` **`cat`** *`filename`*<br>`$` **`cat`** *`<file name>`*<br><br>Eğer MyFile.txt adlı dosyanın içeriğini görüntülemeniz gerekiyorsa, aşağıdaki komutu çalıştırın:<br>`cat MyFile.txt` |