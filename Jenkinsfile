pipeline {
    agent { label 'minikube' }

    environment {
        IMAGE_CLIENT = 'arjun332/medlem-frontend:latest'
        IMAGE_SERVER = 'arjun332/medlem-backend:latest'
    }

    stages {
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "[INFO] Setting up Docker env for Minikube"
                    eval $(minikube docker-env)

                    echo "[INFO] Building Client Image"
                    docker build -t $IMAGE_CLIENT ./medlem

                    echo "[INFO] Building Server Image"
                    docker build -t $IMAGE_SERVER ./backend
                '''
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {
                sh '''
                    echo "[INFO] Deploying to Kubernetes Cluster"
                    kubectl apply -f k8s/client-deployment.yaml
                    kubectl apply -f k8s/client-cluster-ip-service.yaml

                    kubectl apply -f k8s/server-deployment.yaml
                    kubectl apply -f k8s/server-cluster-ip-service.yaml

                    kubectl apply -f k8s/ingress-service.yaml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "[INFO] Verifying deployments and services"
                    kubectl get pods
                    kubectl get svc
                    kubectl get ingress
                '''
            }
        }
    }
}
