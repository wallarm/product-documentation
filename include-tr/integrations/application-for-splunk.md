To get Wallarm events organized into a ready-to-use dashboard in Splunk 9.0 or later, you can install the [Wallarm application for Splunk](https://splunkbase.splunk.com/app/6610).

Splunk 9.0 veya sonrasında Wallarm etkinliklerini kullanıma hazır bir gösterge tablosunda düzenlemek için, [Splunk için Wallarm uygulamasını](https://splunkbase.splunk.com/app/6610) kurabilirsiniz.

This application provides you with a pre-configured dashboard that is automatically filled with the events received from Wallarm. In addition to that, the application enables you to proceed to detailed logs on each event and export the data from the dashboard.

Bu uygulama, Wallarm'dan alınan etkinliklerle otomatik olarak doldurulan önceden yapılandırılmış bir gösterge tablosu sunar. Buna ek olarak, uygulama her bir etkinliğin detaylı günlük kayıtlarına geçmenizi ve gösterge tablosundaki verileri dışa aktarmanızı sağlar.

![Splunk dashboard][splunk-dashboard-by-wallarm-img]

To install the Wallarm application for Splunk:

Splunk için Wallarm uygulamasını kurmak için:

1. In the Splunk UI ➝ **Apps** find the `Wallarm API Security` application.
1. Splunk UI ➝ **Apps** içinde `Wallarm API Security` uygulamasını bulun.
1. Click **Install** and input the Splunkbase credentials.
1. **Install**'a tıklayın ve Splunkbase kimlik bilgilerini girin.

If some Wallarm events are already logged in Splunk, they will be displayed on the dashboard, as well as further events Wallarm will discover.

Eğer bazı Wallarm etkinlikleri zaten Splunk'a kaydedilmişse, gösterge tablosunda görüntülenecek; ayrıca Wallarm'ın keşfedeceği ek etkinlikler de görünecektir.

In addition, you can fully customize the ready-to-use dashboard, e.g. its view or [search strings](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search) used to extract data from all Splunk records.

Ayrıca, kullanılabilir gösterge tablosunu (örneğin görünümü veya tüm Splunk kayıtlarından veri çıkarmak için kullanılan [arama dizilerini](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search)) tamamen özelleştirebilirsiniz.