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
        # عنصر من Wallarm: تعريف حاوية Wallarm الجانبية
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # نقطة نهاية API الخاصة بـ Wallarm: 
          # "api.wallarm.com" لسحابة الاتحاد الأوروبي
          # "us1.api.wallarm.com" لسحابة الولايات المتحدة
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # اسم المستخدم للمستخدم بدور النشر
          - name: DEPLOY_USER
            value: "username"
          # كلمة السر للمستخدم بدور النشر
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # الكمية من الذاكرة بجيجابايت لبيانات تحليل الطلبات
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # المنفذ الذي يستقبل عليه حاوية Wallarm الجانبية الطلبات
            # من كائن الخدمة
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # تعريف حاوية التطبيق الأساسية الخاصة بك
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # المنفذ الذي تستقبل عليه حاوية التطبيق الطلبات الواردة
          - containerPort: 8080
      volumes:
      # عنصر من Wallarm: تعريف حجم wallarm-nginx-conf
      - name: wallarm-nginx-conf
        configMap:
          name: wallarm-sidecar-nginx-conf
          items:
            - key: default
              path: default
```