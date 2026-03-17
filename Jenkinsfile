pipeline {
    agent any

    environment {
        IMAGE_NAME = "mrshah21/2023bcs_181"
        IMAGE_TAG = "v1"
    }

    stages {

        stage('Checkout Code'){
            steps {
                git branch: 'main',
                    url: 'https://github.com/vs-abhinav-dev/assignment_5.git'
            }
        }

        stage('Build Docker Image'){
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Tag Docker Image'){
            steps {
                sh 'docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest'
            }
        }

        stage('Docker Hub Login'){
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push'){
            steps {
                sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

    }
}
