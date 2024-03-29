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
        # عنصر Wallarm: تعريف حاوية الوسيطة لـ Wallarm
        - name: wallarm
          image: wallarm/node:3.2.1-1
          imagePullPolicy: Always
          env:
          # نقطة نهاية واجهة برمجة تطبيقات Wallarm: 
          # "api.wallarm.com" للسحابة الأوروبية
          # "us1.api.wallarm.com" للسحابة الأمريكية
          - name: WALLARM_API_HOST
            value: "api.wallarm.com"
          # اسم المستخدم للمستخدم له دور الانتشار
          - name: DEPLOY_USER
            value: "username"
          # كلمة مرور المستخدم له دور الانتشار
          - name: DEPLOY_PASSWORD
            value: "password"
          - name: DEPLOY_FORCE
            value: "true"
          # الكمية من الذاكرة بجيجابايت لبيانات تحليلات الطلبات
          - name: TARANTOOL_MEMORY_GB
            value: "2"
          ports:
          - name: http
            # الباب الذي تقبل حاوية الوسيطة لـ Wallarm الطلبات من خلاله
            # من عنصر الخدمة
            containerPort: 80
          volumeMounts:	
          - mountPath: /etc/nginx/sites-enabled	
            readOnly: true	
            name: wallarm-nginx-conf
        # تعريف حاوية تطبيقك الرئيسية
        - name: myapp
          image: <Image>
          resources:
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
          # الباب الذي تقبل حاوية التطبيق الواردات الطلبات من خلاله
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