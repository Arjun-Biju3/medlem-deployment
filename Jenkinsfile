// pipeline {
//     agent { label 'minikube' }

//     triggers {
//         pollSCM('* * * * *') 
//     }


//     environment {
//         IMAGE_CLIENT = 'arjun332/medlem-frontend:latest'
//         IMAGE_SERVER = 'arjun332/medlem-backend:latest'
//     }

//     stages {
//         stage('Build Docker Images') {
//             steps {
//                 sh '''
//                     echo "[INFO] Setting up Docker env for Minikube"
//                     eval $(minikube docker-env)

//                     echo "[INFO] Building Client Image"
//                     docker build -t $IMAGE_CLIENT ./medlem

//                     echo "[INFO] Building Server Image"
//                     docker build -t $IMAGE_SERVER ./backend
//                 '''
//             }
//         }

//         stage('Apply Kubernetes Manifests') {
//             steps {
//                 sh '''
//                     echo "[INFO] Deploying to Kubernetes Cluster"
//                     kubectl apply -f k8s/client-deployment.yaml
//                     kubectl apply -f k8s/client-cluster-ip-service.yaml

//                     kubectl apply -f k8s/server-deployment.yaml
//                     kubectl apply -f k8s/server-cluster-ip-service.yaml

//                     kubectl apply -f k8s/ingress-service.yaml
//                 '''
//             }
//         }

//         stage('Verify Deployment') {
//             steps {
//                 sh '''
//                     echo "[INFO] Verifying deployments and services"
//                     kubectl get pods
//                     kubectl get svc
//                     kubectl get ingress
//                 '''
//             }
//         }
//     }
// }


pipeline {
    agent { label 'minikube' }

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        IMAGE_CLIENT = 'arjun332/medlem-frontend:latest'
        IMAGE_SERVER = 'arjun332/medlem-backend:latest'
    }

    stages {
        stage('Build and Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo "[INFO] Docker login"
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                        echo "[INFO] Building Client Image"
                        docker build -t $IMAGE_CLIENT ./medlem

                        echo "[INFO] Building Server Image"
                        docker build -t $IMAGE_SERVER ./backend

                        echo "[INFO] Pushing images to Docker Hub"
                        docker push $IMAGE_CLIENT
                        docker push $IMAGE_SERVER
                    '''
                }
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
