!!! warning "ربط عقدة FAST بأحد سحابات Wallarm"
    عقدة FAST تتفاعل مع أحد [السحابات المتاحة من Wallarm](../../cloud-list.md). بشكل افتراضي، عقدة FAST تعمل مع خادم API الموجود في السحابة الأمريكية.
    
    لتوجيه عقدة FAST لاستخدام خادم API من سحابة أخرى، امرر إلى وعاء العقدة متغير البيئة `WALLARM_API_HOST` الذي يُشير إلى عنوان خادم API اللازم من Wallarm.
    
    مثال (لعقدة FAST تستخدم خادم API الموجود في سحابة Wallarm الأوروبية):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```