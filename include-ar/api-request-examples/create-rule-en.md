=== "السحابة الأمريكية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"الإجراء\": [ {\"النوع\":\"مساوي\",\"القيمة\":\"my\",\"النقطة\":[\"المسار\",0]}, {\"النوع\":\"مساوي\",\"القيمة\":\"api\",\"النقطة\":[\"المسار\",1]}], \"تم التحقق منه\": false, \"النقطة\": [ [ \"الرأس\", \"HOST\" ] ], \"نوع الهجوم\": \"أي\"}"
    ```
=== "السحابة الأوروبية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"الإجراء\": [ {\"النوع\":\"مساوي\",\"القيمة\":\"my\",\"النقطة\":[\"المسار\",0]}, {\"النوع\":\"مساوي\",\"القيمة\":\"api\",\"النقطة\":[\"المسار\",1]}], \"تم التحقق منه\": false, \"النقطة\": [ [ \"الرأس\", \"HOST\" ] ], \"نوع الهجوم\": \"أي\"}"
    ```