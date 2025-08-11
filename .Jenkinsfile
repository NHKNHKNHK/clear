// jenkins流水线

pipeline {
    agent any

    stages {
        stage('Setup Environment') {
                steps {
                    script {
                        echo "设置Node.js环境 (v${env.NODE_VERSION})"
                        // 使用nvm或n来管理Node版本
                        sh '''
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                            nvm install ${NODE_VERSION}
                            nvm use ${NODE_VERSION}
                            node -v
                            npm -v
                        '''
                    }
                }
            }
        stage('Checkout') {
                steps {
                    script {
                        echo "从Gitee仓库拉取代码: ${env.GITEE_REPO}"
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: "${env.BRANCH}"]],
                            userRemoteConfigs: [[
                                url: "${env.GITEE_REPO}",
                                credentialsId: "${env.GITEE_CREDENTIALS_ID}"
                            ]]
                        ])
                    }
                }
            }
     // 阶段3：安装依赖
 stage('Install Dependencies') {
            steps {
                script {
                    echo '安装项目依赖...'
                    sh 'npm install'
                    sh 'pnpm install'
                }
            }
        }
 stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh 'pnpm run docs:build'  // 默认的VitePress构建命令
                }
            }
        }

        // 阶段5：部署
        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'
                    // 这里提供几种常见的部署方式示例

                    // 选项1：使用rsync部署到远程服务器
                    // sh 'rsync -avz --delete ./dist/ user@server:/path/to/www/'

                    // 选项2：使用SSH部署
                    // sshPublisher(
                    //     publishers: [
                    //         sshPublisherDesc(
                    //             configName: 'your-ssh-server',
                    //             transfers: [
                    //                 sshTransfer(
                    //                     sourceFiles: 'dist/**',
                    //                     removePrefix: 'dist',
                    //                     remoteDirectory: '/var/www/html'
                    //                 )
                    //             ]
                    //         )
                    //     ]
                    // )

                    // 选项3：存档构建产物供后续使用
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true

                    echo '部署完成！'
                }
            }
        }
  }
  post {
          success {
              echo 'VitePress项目构建部署成功！'
              // 可以添加成功通知
          }
          failure {
              echo '构建失败！'
              // 可以添加失败通知
          }
      }
}