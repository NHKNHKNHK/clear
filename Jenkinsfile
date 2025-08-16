pipeline {
    agent any

    environment {
        // Gitee仓库配置
        GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
        GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
        BRANCH = 'master'
        NODE_VERSION = '20'
        NVM_DIR = "${env.HOME}/.nvm"
        // 添加部署目标目录变量
        DEPLOY_DIR = '/www/wwwroot/clear-blog'
        // 添加构建产物目录变量
        BUILD_OUTPUT_DIR = "${env.WORKSPACE}/.vitepress/dist"
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    sh '''#!/bin/bash
                        # 安装nvm（如果尚未安装）
                        if [ ! -d "$NVM_DIR" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        fi
                        
                        # 确保nvm脚本可执行
                        [ -s "$NVM_DIR/nvm.sh" ] && chmod +x "$NVM_DIR/nvm.sh"
                        
                        # 加载nvm环境
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        
                        # 安装并使用Node.js
                        nvm install ${NODE_VERSION} || true
                        nvm use ${NODE_VERSION}
                        
                        # 全局安装pnpm
                        npm install -g pnpm
                        
                        # 验证安装
                        echo "Node.js版本: $(node -v)"
                        echo "npm版本: $(npm -v)"
                        echo "pnpm版本: $(pnpm -v)"
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
                    sh '''#!/bin/bash
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        pnpm install
                    '''
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh '''#!/bin/bash
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        pnpm run docs:build
                        
                        # 验证构建产物
                        echo "构建产物路径: ${env.BUILD_OUTPUT_DIR}"
                        ls -la "${env.BUILD_OUTPUT_DIR}"
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
                        mkdir -p "${DEPLOY_DIR}"
                        
                        # 修复构建产物的权限（关键修复）
                        echo "修复构建产物权限..."
                        chown -R $(whoami):$(whoami) "${BUILD_OUTPUT_DIR}" || true
                        chmod -R 755 "${BUILD_OUTPUT_DIR}" || true
                        
                        # 清理目录
                        echo "清理目标目录: ${DEPLOY_DIR}"
                        rm -rf "${DEPLOY_DIR}"/*
                        
                        # 复制构建产物（使用详细输出）
                        echo "从 ${BUILD_OUTPUT_DIR} 复制到 ${DEPLOY_DIR}"
                        cp -rv "${BUILD_OUTPUT_DIR}"/* "${DEPLOY_DIR}"/
                        
                        # 验证复制结果
                        echo "部署后目标目录内容:"
                        ls -la "${DEPLOY_DIR}"
                        
                        # 修复目标目录权限
                        echo "修复目标目录权限..."
                        chown -R $(whoami):$(whoami) "${DEPLOY_DIR}" || true
                        chmod -R 755 "${DEPLOY_DIR}" || true
                        
                        echo '部署完成！'
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'VitePress项目构建部署成功！'
            script {
                sh '''#!/bin/bash
                    echo "验证部署目录内容:"
                    ls -la "${DEPLOY_DIR}"
                    echo "部署完成！"
                '''
            }
        }
        failure {
            echo '构建失败！'
            script {
                sh '''#!/bin/bash
                    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                    pnpm run docs:build --verbose 2>&1 | tee build.log
                    cat build.log
                    
                    # 添加路径验证
                    echo "工作空间路径: ${WORKSPACE}"
                    echo "构建产物路径: ${BUILD_OUTPUT_DIR}"
                    ls -la "${BUILD_OUTPUT_DIR}" || echo "构建产物不存在"
                    
                    # 检查部署目录
                    echo "部署目录内容:"
                    ls -la "${DEPLOY_DIR}" || echo "无法访问部署目录"
                '''
            }
        }
    }
}