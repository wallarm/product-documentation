#   Metin biçimlendirme kuralları

Kılavuzlar boyunca girmeniz veya yürütmeniz gereken çeşitli metin dizgileri ve komutlarla karşılaşacaksınız. Gerektiğinde bazı dizgiler ve komut anahtar sözcükleri farklı biçimlerde gösterilecektir. Aşağıdaki kurallar kılavuzların tamamında geçerlidir:


| Biçimlendirme kuralı                 | Açıklama |
| -----------------------------  | ------------------------------------------------------------    |
|`düzenli` | Sabit genişlikli normal yazı tipiyle yazılan dizgiler bilgi amaçlıdır ve okuyucu tarafından girilmesi beklenmez.<br>Bu tür dizgiler bir komut çıktısını veya başka bir bilgi parçasını temsil edebilir.|
|Örnek: | Bir Bash kabuğunun istemi:<br>`$`                     |
|**`kalın`**  | Kalın, sabit genişlikli yazı tipinde yazılmış dizgiler okuyucu tarafından olduğu gibi girilmelidir. |
|Örnek: | Linux'ta sistem bilgilerini görüntülemek için aşağıdaki komutu girin:<br>`$` **`uname -a`** |
|*`italik`* veya  *`<italik>`* | İtalik, sabit genişlikli yazı tipiyle yazılmış dizgiler, okuyucu tarafından sağlanması gereken değerleri temsil eder. Örneğin, bir komut argümanı *`<name>`* şeklinde biçimlendirilmişse, *`<name>*` yerine bu ad için bir değer sağlamalısınız.<br>Bir girdi tek bir sözcükle tanımlanamıyorsa, dizgi bir çift açılı parantez <...> içine alınır. Bir değer girerken bu parantezleri yazmamalısınız. Örneğin, bir komut argümanı *`<user password>`* olarak biçimlendirilmişse, parolayı < ve > simgeleri olmadan girmelisiniz. |
|Örnek: | `cat` komutu, Linux'ta bir dosyanın içeriğini aşağıdaki şekilde görüntülemek için kullanılabilir:<br>`$` **`cat`** *`filename`*<br>`$` **`cat`** *`<file name>`*<br><br>MyFile.txt adlı dosyanın içeriğini görüntülemeniz gerekiyorsa, aşağıdaki komutu çalıştırın:<br>`cat MyFile.txt` |