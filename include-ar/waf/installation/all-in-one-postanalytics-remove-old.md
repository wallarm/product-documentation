1. احذف وحدة تحليلات المشاركات القديمة في واجهة Wallarm → **العقد** بتحديد عقدة وحدة تحليلات المشاركات الخاصة بك والنقر على **حذف**.
1. أكد العملية.

    عند حذف عقدة وحدة تحليلات المشاركات من السحابة، ستتوقف عن المشاركة في تصفية طلبات تطبيقاتك. لا يمكن التراجع عن الحذف. سيتم حذف عقدة وحدة تحليلات المشاركات نهائيًا من قائمة العقد.

1. احذف الجهاز الذي يحتوي على وحدة تحليلات المشاركات القديمة أو فقط نظفه من مكونات وحدة تحليلات المشاركات Wallarm:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
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