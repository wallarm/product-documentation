[img-verification-statuses]: ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:  ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:  ../../images/user-guides/events/verified.png#mini
[img-error-icon]:  ../../images/user-guides/events/error.png#mini
[img-forced-icon]:  ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:  ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:  ../../images/user-guides/events/cloud.png#mini

[al-brute-force-attack]:  ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:  ../../attacks-vulns-list.md#forced-browsing

# Saldırıların Doğrulanması

Wallarm, aktif zafiyet tespiti için saldırıları otomatik olarak [tekrar kontrol eder](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).

*Olaylar* sekmesinde saldırı doğrulama durumunu kontrol edebilir ve bir saldırı tekrar kontrolünü zorlayabilirsiniz. Seçili saldırı, test saldırı seti oluşturmanın temeli olacaktır.

![Farklı doğrulama durumlarına sahip saldırılar][img-verification-statuses]

## Saldırı Doğrulama Durumunu Kontrol Etme

1. *Olaylar* sekmesini tıklayın.
2. "Doğrulama" sütunundaki durumu kontrol edin.

## Saldırı Doğrulama Durum Efsanesi

* ![Doğrulandı][img-verified-icon] *Doğrulanmış*: Saldırı doğrulandı.
* ![Hata][img-error-icon] *Hata*: Doğrulama desteklemeyen bir saldırı türünün doğrulanması denendi.
* ![Zorlama][img-forced-icon] *Zorlanmış*: Saldırının doğrulama sırasında önceliği yükseltildi.
* ![Programlı][img-sheduled-icon] *Programlanmış*: Saldırı, doğrulama için sıraya alındı.
* ![Bağlanamadı][img-cloud-icon] *Sunucuya bağlanılamıyor*: Şu anda sunucuya erişilemiyor.

## Bir Saldırı Doğrulamasını Zorlama

1. Bir saldırıyı seçin.
2. "Doğrulama" sütunundaki durum işaretini tıklayın.
3. *Doğrulamayı zorla* tıklayın.

Wallarm, kuyruktaki saldırı doğrulamasının önceliğini yükseltecektir.

![Saldırıların doğrulanması][img-verify-attack]

## Doğrulama Desteklemeyen Saldırı Türleri

Aşağıdaki türlerdeki saldırılar doğrulama desteklemez:

* [Kaba kuvvet][al-brute-force-attack]
* [Zorlanmış gezinme][al-forced-browsing]
* İstek işleme limiti olan saldırılar
* Zaten kapatılmış olan zafiyetlere yönelik saldırılar
* Doğrulama için yeterli veri içermeyen saldırılar
* [Kökeni aynı IP'den gruplanmış vuruşları içeren saldırılar](../triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack)

Saldırı yeniden kontrolü aşağıdaki durumlarda başarısız olacaktır:

* gRPC veya Protobuff protokolü aracılığıyla gönderilen saldırılar
* 1.x'ten farklı bir sürümdeki HTTP protokolü aracılığıyla gönderilen saldırılar
* Aşağıdakilerden farklı bir yöntemle gönderilen saldırılar: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
* Orijinal isteğin adresine ulaşamama
* Saldırı işaretleri `HOST` başlığındadır
* Saldırı işaretlerini içeren [İstek elementi](../rules/request-processing.md) aşağıdakilerden biriyle farklı: `uri` , `header`, `query`, `post`, `path`, `action_name`, `action_ext`