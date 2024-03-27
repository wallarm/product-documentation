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
        # عنصر Wallarm: تعريف حاوية جانبية لـ Wallarm
        - name: wallarm
          image: wallarm/node:3.6.2-1
          imagePullPolicy: Always
          env:
          # نقطة النهاية لـ API Wallarm: 
          # "api.wallarm.com" للسحابة الأوروبية
          # "us1.api.wallarm.com" للسحابة الأمريكية
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # اسم مستخدم بدور التنصيب
          - name: DEPLOY_USER
            value: "username"
          # كلمة مرور المستخدم بدور التنصيب
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # كمية الذاكرة بـ جيجابايت لبيانات تحليل الطلبات
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # المنفذ الذي تستقبل عليه حاوية Wallarm الجانبية الطلبات
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
      # عنصر Wallarm: تعريف مجلد wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```