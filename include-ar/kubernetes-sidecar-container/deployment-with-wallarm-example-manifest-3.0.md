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
        # عنصر Wallarm: تعريف حاوية الوكيل Wallarm
        - name: wallarm
          image: wallarm/node:3.0.0-3
          imagePullPolicy: Always
          env:
          # نقطة نهاية API لـ Wallarm: 
          # "api.wallarm.com" للسحابة الأوروبية
          # "us1.api.wallarm.com" للسحابة الأمريكية
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # اسم المستخدم بدور النشر
          - name: DEPLOY_USER
            value: "username"
          # كلمة السر للمستخدم بدور النشر
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # حجم الذاكرة بالجيجابايت لبيانات تحليلات الطلب
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # البورت الذي يقبل فيه حاوية الوكيل Wallarm الطلبات 
            # من كائن الخدمة
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # تعريف حاوية التطبيق الرئيسي
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # البورت الذي تقبل فيه حاوية التطبيق الطلبات الواردة
          - containerPort: 8080
      volumes:
      # عنصر Wallarm: تعريف حجم wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```