Splunk 9.0 veya daha yeni sürümlerde Wallarm olaylarını kullanıma hazır bir gösterge panelinde düzenlemek için [Splunk için Wallarm uygulamasını](https://splunkbase.splunk.com/app/6610) kurabilirsiniz.

Bu uygulama, Wallarm’dan alınan olaylarla otomatik olarak doldurulan, önceden yapılandırılmış bir gösterge paneli sunar. Ayrıca, uygulama her olayın ayrıntılı günlüklerini görüntülemenizi ve gösterge panelinden verileri dışa aktarmanızı sağlar.

![Splunk gösterge paneli][splunk-dashboard-by-wallarm-img]

Splunk için Wallarm uygulamasını yüklemek için:

1. Splunk UI ➝ **Apps** içinde `Wallarm API Security` uygulamasını bulun.
1. **Install**’a tıklayın ve Splunkbase kimlik bilgilerini girin.

Bazı Wallarm olayları Splunk’ta zaten kaydedildiyse, bunlar ve Wallarm’ın daha sonra keşfedeceği olaylar gösterge panelinde görüntülenecektir.

Ayrıca, kullanıma hazır gösterge panelini tamamen özelleştirebilirsiniz; örneğin görünümünü veya tüm Splunk kayıtlarından veri çıkarmak için kullanılan [arama sorgularını](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search).