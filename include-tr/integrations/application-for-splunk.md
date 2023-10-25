Splunk 9.0 veya sonrasında Wallarm olaylarınızı kullanıma hazır bir dashboarda düzenlemek için [Splunk için Wallarm uygulamasını](https://splunkbase.splunk.com/app/6610) yükleyebilirsiniz.

Bu uygulama, Wallarm'dan alınan olaylarla otomatik olarak doldurulan ön yapılandırılmış bir dashboard sağlar. Bunun yanında, uygulama her olay üzerinde ayrıntılı loglara geçiş yapmanızı ve verileri dashboarddan dışa aktarmanızı sağlar.

![Splunk dashboard][splunk-dashboard-by-wallarm-img]

Splunk için Wallarm uygulamasını yüklemek için:

1. Splunk UI'de ➝ **Uygulamalar** `Wallarm API Güvenliği` uygulamasını bulun.
1. **Yükleyin**'e tıklayın ve Splunkbase kimlik bilgilerini girin.

Eğer bazı Wallarm olayları zaten Splunk'ta loglandıysa, bunlar doğrudan dashboardda görüntülenecektir, aynı zamanda Wallarm'ın keşfedeceği ileri olaylar da görüntülenecektir.

Ek olarak, kullanıma hazır dashboardu tamamen özelleştirebilirsiniz, örneğin, görünümü veya tüm Splunk kayıtlarından veri çıkarmak için kullanılan [arama dizgileri](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search).
