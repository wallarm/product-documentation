[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

#   Nagios'ta Filter Node Metrikleri ile Çalışma

Nagios'un daha önce oluşturulan servisin durumunu başarıyla izlediğini doğrulayın:
1.  Nagios web arayüzüne giriş yapın.
2.  “Services” bağlantısına tıklayarak servisler sayfasına gidin.
3.  `wallarm_nginx_abnormal` servisinin görüntülendiğinden ve “OK” durumunda olduğundan emin olun:

    ![Servis durumu][img-nagios-service-status]

    
    !!! info "Servis kontrolünü zorla"
        Servis “OK” durumunda değilse, servisin durumunu doğrulamak için kontrolü zorlayabilirsiniz.
        
        Bunu yapmak için, “Service” sütununda servis adına tıklayın, ardından “Service Commands” listesinden “Reschedule the next check of this service” seçeneğini işaretleyip gerekli parametreleri girerek kontrolü başlatın.    
    

4.  “Status” sütununda servis adının yer aldığı bağlantıya tıklayarak servis hakkında detaylı bilgileri görüntüleyin:

    ![Servis hakkında detaylı bilgi][img-nagios-service-details]

    Nagios'ta görüntülenen metrik değerinin ( “Performance Data” satırı) filter node üzerindeki `wallarm-status` çıktısıyla eşleştiğinden emin olun:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
 
5.  Filter node tarafından korunan bir uygulamaya test saldırısı gerçekleştirin. Bunu yapmak için, curl aracı ya da bir tarayıcı kullanarak uygulamaya zararlı bir istek gönderebilirsiniz.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
6.  Nagios'taki “Performance Data” değerinin arttığından ve filter node üzerindeki `wallarm-status` çıktısıyla eşleştiğinden emin olun:

    --8<-- "../include/monitoring/wallarm-status-output-latest.md"

    ![Güncellenmiş Performance Data değeri][img-nagios-service-perfdata-updated]

Artık filter node'un `wallarm_nginx/gauge-abnormal` metrik değerleri Nagios'ta servis durum bilgileri arasında görüntülenmektedir.

!!! info "Nagios veri görselleştirmesi"
    Varsayılan olarak, Nagios Core yalnızca servis durumlarının (`OK`, `WARNING`, `CRITICAL`) izlenmesini destekler. “Performance Data” içerisinde yer alan metrik değerlerini saklamak ve görselleştirmek için üçüncü taraf araçlar, örneğin [PNP4Nagios][link-PNP4Nagios] kullanabilirsiniz.