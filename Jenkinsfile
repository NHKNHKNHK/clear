pipeline {
    agent any

    environment {
        // Gitee仓库配置
        GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
        GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
        BRANCH = 'master'

        // Node.js配置
        NODE_VERSION = '20'
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    // 安装nvm和Node.js
                    sh '''#!/bin/bash -l
                        # 安装nvm
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        # 加载nvm环境
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"  # 使用source命令加载nvm
                        # 安装Node.js 20
                        nvm install ${NODE_VERSION}
                        # 使用Node.js 20
                        nvm use ${NODE_VERSION}
                        # 安装pnpm
                        npm install -g pnpm
                        # 检查版本
                        node -v
                        npm -v
                        pnpm -v
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

        stage('Install Dependencies') {
            steps {
                script {
                    echo '安装项目依赖...'
                    sh '''#!/bin/bash -l
                        # 确保nvm环境已加载
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                        pnpm install
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh '''#!/bin/bash -l
                        # 确保nvm环境已加载
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                        pnpm run docs:build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'
                    sh '''#!/bin/bash
                        # 确保目标目录存在
                        mkdir -p /www/wwwroot/clear-blog
                        # 清理并复制文件
                        rm -rf /www/wwwroot/clear-blog/*
                        cp -r .vitepress/dist/* /www/wwwroot/clear-blog/
                        echo '部署完成！'
                    '''
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