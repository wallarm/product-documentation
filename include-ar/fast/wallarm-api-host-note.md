!!! تحذير "ربط عقدة FAST بأحد سحب Wallarm"
    عقدة FAST تتفاعل مع أحد [سحب Wallarm المتاحة](../cloud-list.md). بشكل افتراضي، تعمل عقدة FAST مع خادم API الخاص بWallarm الموجود في السحابة الأمريكية.
    
    لتوجيه عقدة FAST لاستخدام خادم API من سحابة أخرى، امرر إلى حاوية العقدة متغير البيئة `WALLARM_API_HOST` الذي يشير إلى عنوان خادم API الضروري لWallarm.

    مثال (لعقدة FAST تستخدم خادم API الموجود في سحابة Wallarm الأوروبية):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```