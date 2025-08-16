// jenkins流水线

pipeline {
    agent any

    environment {
            // Gitee仓库配置
            GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
            GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
            BRANCH = 'master'

            // Node.js配置
            NODE_VERSION = '20'  // 使用系统已有Node.js 20环境
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    // 使用nvm或n来管理Node版本
                    sh '''
                        # 检查系统Node.js环境
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
                    sh 'pnpm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh 'pnpm run docs:build'  // 使用pnpm执行构建命令
                }
            }
        }

        // 阶段5：部署
        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'

                    // 选项1：使用rsync部署到远程服务器（请替换实际用户、服务器和路径）
                    sh '''
                        # 注意：需确保Jenkins容器已挂载宿主机目录（-v /www/wwwroot/clear-blog:/www/wwwroot/clear-blog）
                        # 删除旧版本文件
                        rm -rf /www/wwwroot/clear-blog/*
                        # 复制新版本构建产物（构建产物路径：docs/.vitepress/dist）
                        cp -r .vitepress/dist/* /www/wwwroot/clear-blog/
                    '''


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