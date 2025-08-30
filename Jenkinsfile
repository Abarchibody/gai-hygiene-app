import java.text.SimpleDateFormat

def sendNotification(status) {
  def COLOR_MAP = [
    'SUCCESS': '\u001B[32m',
    'FAILURE': '\u001B[31m',
    'ABORTED': '\u001B[33m',
    'UNSTABLE': '\u001B[33m'
  ]

  def STATUS_MAP = [
    'STARTED': ['color': '🔵', 'emoji': '🟡'],
    'SUCCESS': ['color': '🟢', 'emoji': '✅'],
    'FAILURE': ['color': '🔴', 'emoji': '❌'],
    'ABORTED': ['color': '🟡', 'emoji': '⚠️'],
    'UNSTABLE': ['color': '🟠', 'emoji': '⚠️']
  ]

  def statusInfo = STATUS_MAP[status]
  def message = "🚀 GAI Hygiene App Deployment\n" +
                "📌 Pipeline: ${env.JOB_NAME}\n" +
                "🆔 Build ID: ${env.BUILD_NUMBER}\n" +
                "${statusInfo.color} Status: ${status} ${statusInfo.emoji}"

  try {
    slackSend channel: '#deployments',
              color: COLOR_MAP[status],
              message: message
  } catch (Exception e) {
    echo "Failed to send Slack notification: ${e.message}"
  }
}

pipeline {
  agent any

  environment {
    AWS_DEFAULT_REGION = 'us-east-1'
    S3_BUCKET = 'your-s3-bucket-name'
    S3_PATH = 'gai-hygiene-app'
  }

  stages {
    stage('Setup') {
      steps {
        script {
          sendNotification('STARTED')
        }
        echo "Setting up Node.js environment"
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy to S3') {
      steps {
        withAWS(credentials: 'aws-s3-deployment-credentials', region: env.AWS_DEFAULT_REGION) {
          sh """
            aws s3 sync dist/ s3://${S3_BUCKET}/${S3_PATH}/ --delete
            aws s3 cp dist/index.html s3://${S3_BUCKET}/${S3_PATH}/index.html --cache-control 'no-cache'
          """
        }
      }
    }

    stage('Invalidate CloudFront') {
      steps {
        withAWS(credentials: 'aws-s3-deployment-credentials', region: env.AWS_DEFAULT_REGION) {
          sh """
            aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/${S3_PATH}/*'
          """
        }
      }
    }
  }

  post {
    always {
      script {
        def status = currentBuild.result ?: 'SUCCESS'
        sendNotification(status)
      }
      cleanWs()
    }
  }
}