node {
  stage('SCM') {
    checkout scm
  }
  stage('Install dependencies') {
    sh '''
      pnpm install
    '''
  }
  stage('Test with coverage') {
    sh '''
      pnpm test
    '''
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}