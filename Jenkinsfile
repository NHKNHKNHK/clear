pipeline {
    agent any

    environment {
        // Gitee仓库配置
        GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
        GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
        BRANCH = 'master'
        NODE_VERSION = '20'
        NVM_DIR = "${env.HOME}/.nvm"
        // 添加构建产物目录变量
        BUILD_OUTPUT_DIR = "$env.WORKSPACE/.vitepress/dist"
        HOST_TARGET_DIR = "/www/wwwroot/clear-blog"
        // Jenkins容器名称或ID（需要替换为实际值）
        JENKINS_CONTAINER = "7ff384ec65af"
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
                        nvm install $NODE_VERSION || true
                        nvm use $NODE_VERSION
                        
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
                        echo "构建产物路径: $BUILD_OUTPUT_DIR"
                        ls -la "$BUILD_OUTPUT_DIR"
                    '''
                }
            }
        }

        stage('Copy to Host') {
            steps {
                script {
                    echo "将构建产物复制到宿主机..."
                    // 在宿主机执行docker cp命令
                    // sh """
                    //     # 确保宿主机目标目录存在
                    //     mkdir -p $env.HOST_TARGET_DIR
                        
                    //     # 执行docker cp命令将容器内文件复制到宿主机
                    //     docker cp $env.JENKINS_CONTAINER:$env.BUILD_OUTPUT_DIR/. $env.HOST_TARGET_DIR

                    //     # 设置正确的权限（根据需要调整）
                    //     chmod -R 755 $env.HOST_TARGET_DIR
                    //     chown -R www:www $env.HOST_TARGET_DIR
                    // """
                    sh """
                        # 1. 先把产物从容器复制到宿主机
                        mkdir -p $HOST_TARGET_DIR
                        docker cp $JENKINS_CONTAINER:$BUILD_OUTPUT_DIR/. $HOST_TARGET_DIR
                
                        # 2. 关键修复：直接指定宿主机的用户ID和组ID
                        # 先获取宿主机上www用户的UID和GID
                        WWW_UID=${docker run --rm --net=host -v /etc/passwd:/etc/passwd:ro alpine grep www /etc/passwd | cut -d: -f3)}
                        WWW_GID=${docker run --rm --net=host -v /etc/passwd:/etc/passwd:ro alpine grep www /etc/passwd | cut -d: -f4)}
                        
                        # 使用UID:GID方式设置权限，避免用户名称解析问题
                        chown -R $WWW_UID:$WWW_GID $HOST_TARGET_DIR
                        chmod -R 755 $HOST_TARGET_DIR
                    """
                }
            }
        }

    }
    
    post {
        success {
            echo 'VitePress项目构建部署成功！'
        }
        failure {
            echo '构建失败！'
        }
    }
}