```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        # عنصر Wallarm: تعريف حاوية القطعة الجانبية Wallarm 
        - name: wallarm
          image: wallarm/node:2.18.1-5
          imagePullPolicy: Always
          env:
          # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
          # "api.wallarm.com" للسحابة الأوروبية
          # "us1.api.wallarm.com" للسحابة الأمريكية
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # اسم المستخدم للمستخدم بدور النشر
          - name: DEPLOY_USER
            value: "username"
          # كلمة المرور للمستخدم بدور النشر
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # ما إذا كان سيتم تفعيل وظيفة حظر الآي بي
          - name: WALLARM_ACL_ENABLE
            value: "true"
          # كمية الذاكرة بالجيجابايت لبيانات تحليلات الطلبات
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # المنفذ الذي تقبل عليه حاوية القطعة الجانبية Wallarm الطلبات
            # من كائن الخدمة
            containerPort: 80
          volumeMounts:    
          - mountPath: /etc/nginx/sites-enabled    
            readOnly: true    
            name: wallarm-nginx-conf
        # تعريف حاوية التطبيق الرئيسية الخاصة بك
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # المنفذ الذي تقبل عليه حاوية التطبيق الطلبات الواردة
          - containerPort: 8080
      volumes:
      # عنصر Wallarm: تعريف وحدة التخزين wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```