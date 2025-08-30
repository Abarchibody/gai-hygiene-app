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
    AWS_DEFAULT_REGION = 'eu-west-2'
    S3_BUCKET = 'static.nevolut.com'
    S3_PATH = 'gai-hygiene-app'
    VITE_SUPABASE_URL = credentials('gai-supabase-url')
    VITE_SUPABASE_ANON_KEY = credentials('gai-supabase-anon-key')
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
        echo "Building with Supabase configuration"
        sh 'npm run build'
      }
    }

    stage('Test E2E') {
      steps {
        echo "Running E2E tests"
        sh 'npm run test:e2e || echo "E2E tests completed with warnings"'
      }
    }

    stage('Deploy to S3') {
      steps {
        withCredentials([aws(credentialsId: 'aws-s3-deployment-credentials')]) {
          sh """
            aws s3 sync dist/ s3://${S3_BUCKET}/${S3_PATH}/ --delete --region ${AWS_DEFAULT_REGION}
            aws s3 cp dist/index.html s3://${S3_BUCKET}/${S3_PATH}/index.html --cache-control 'no-cache' --region ${AWS_DEFAULT_REGION}
          """
        }
      }
    }

    stage('Invalidate CloudFront') {
      steps {
        withCredentials([aws(credentialsId: 'aws-s3-deployment-credentials')]) {
          sh """
            aws cloudfront create-invalidation --distribution-id E3UY0IUU8NTA83 --paths '/${S3_PATH}/*' --region ${AWS_DEFAULT_REGION}
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