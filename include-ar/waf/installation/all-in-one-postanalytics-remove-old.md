1. احذف وحدة postanalytics القديمة في Wallarm Console → **Nodes** بتحديد وحدة postanalytics الخاصة بك والنقر على **حذف**.
1. تأكيد الإجراء.

    عند حذف وحدة postanalytics من السحابة، سيتوقف مشاركتها في تصفية الطلبات إلى تطبيقاتك. لا يمكن التراجع عن الحذف. سيتم حذف وحدة postanalytics نهائيًا من قائمة الوحدات.

1. احذف الجهاز الذي يحتوي على وحدة postanalytics القديمة أو فقط نظفه من مكونات وحدة postanalytics من Wallarm:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x والإصدارات الأدنى"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```